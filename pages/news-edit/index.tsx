import { Spin, Pagination, Empty, Form } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ButtonPrimary } from "../../components/button";
import { InputSearch } from "../../components/input";
import { Modal } from "../../components/modal";
import { ListItem } from "../../components/listItem";
import { Input, InputTextArea } from "../../components/input";
import { DatePicker } from "../../components/datePicker";
import {
  postService,
  deleteService,
  getService,
  putService,
} from "../../services/apiRequest";
import {
  NewsItemReducerInterface,
  NewsListReducerInterface,
} from "../../store/newsEdit/model";
import {
  newsEditUpdateList,
  newsEditStartItemActionLoading,
  newsEditStartListLoading,
  newsEditStartSaveLoading,
  newsEditStopListLoading,
  newsEditStopSaveLoading,
} from "../../store/newsEdit/actions";
import { maskDate } from "../../util";
import moment from "moment";

export default function NewsEdit() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [reloadList, setReloadList] = useState(0);
  const [selectedUpdate, setSelectedUpdate] = useState<
    NewsItemReducerInterface
  >(null);
  const [titleSearch, setTitleSearch] = useState("");
  const [showModal, setShowModal] = useState(false);

  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const newsListOnReducer = useSelector(
    (state: { newsEdit: NewsListReducerInterface }) => state.newsEdit
  );
  const url = "/news";

  useEffect(() => {
    getNewsList();
  }, [page, limit, reloadList]);

  const getNewsList = async () => {
    dispatch(newsEditStartListLoading());

    const props = {
      url,
      limit,
      page,
      title: null,
    };

    if (titleSearch.length > 3) props.title = titleSearch;

    const { ok, data } = await getService(props);
    if (ok) {
      const { rows, count } = data;
      setTotal(count);

      dispatch(
        newsEditUpdateList(
          rows.map((item) => ({
            ...item,
            expiresIn: new Date(item.expires_in),
            createdAt: new Date(item.created_at),
          }))
        )
      );
      setTotal(count);
    }

    dispatch(newsEditStopListLoading());
  };

  const handleSaveNews = async (values: any) => {
    dispatch(newsEditStartSaveLoading());

    let noErrors = false;

    if (selectedUpdate) {
       const { ok } = await putService({
            id: selectedUpdate.id,
            url,
            values,
        });

        noErrors = ok;
    }
    else {
        const { ok } = await postService({
            url,
            values,
        });

        noErrors = ok;
    }

    if (noErrors) {
      handleCloseModalCreate();
      setReloadList(reloadList + 1);
    }

    setTimeout(() => {
      if (noErrors) {
        setReloadList(reloadList + 1);
      }

      dispatch(newsEditStopSaveLoading());
    }, 2000);
  };

  const handleSelectNews = (index: number) => {
    setSelectedUpdate(newsListOnReducer.list[index]);

    form.setFieldsValue({
      ...newsListOnReducer.list[index],
      expires_in: moment(newsListOnReducer.list[index].expiresIn),
    });

    setShowModal(true);
  };

  const handleSearch = (description: string) => {
    setTitleSearch(description);
    setPage(1);
    setReloadList(reloadList + 1);
  };

  const handleDeleteNews = async (index: number) => {
    dispatch(newsEditStartItemActionLoading(index));

    const { id } = newsListOnReducer.list[index];

    const { ok } = await deleteService({
        id,
        url,
    });

    if(ok) setReloadList(reloadList + 1);
  };

  const handleCloseModalCreate = () => {
    setShowModal(false);
    setSelectedUpdate(null);
    form.setFieldsValue({
      title: "",
      expires_in: "",
      description: "",
    });
  };

  return (
    <div id="news-edit-page">
      <Spin spinning={newsListOnReducer.loadingList}>
        <div className="news-edit-search">
          <InputSearch
            placeholder="Título da notícia"
            onSearch={(e) => handleSearch(e)}
          />

          <ButtonPrimary onClick={() => setShowModal(true)}>Novo</ButtonPrimary>
        </div>

        {total > 0 ? (
          <main>
            <div className="news-edit-list">
              {newsListOnReducer.list.map((item, index) => {
                return (
                  <ListItem
                    key={index + ""}
                    title={item.title}
                    subtitle={`Criada em: ${maskDate(
                      item.createdAt
                    )} - Expira em: ${maskDate(item.expiresIn)}`}
                    onEdit={() => handleSelectNews(index)}
                    onDelete={() => handleDeleteNews(index)}
                    onActionLoad={item.loadingItemAction}
                  />
                );
              })}
            </div>

            <Pagination
              defaultCurrent={page}
              defaultPageSize={limit}
              onChange={(e) => setPage(e)}
              onShowSizeChange={(e, f) => setLimit(f)}
              total={total}
            />
          </main>
        ) : (
          <Empty description="Esta lista está vazia." />
        )}
      </Spin>

      <Modal
        title="Notícia"
        isVisible={showModal}
        onOk={() => {
          form.submit();
        }}
        onCancel={handleCloseModalCreate}
        confirmLoading={newsListOnReducer.loadingSave}
      >
        <Form onFinish={handleSaveNews} form={form}>
          <Form.Item
            name="title"
            rules={[{ required: true, message: "Insira um título" }]}
          >
            <Input placeholder="Título da notícia" title="Título da notícia" />
          </Form.Item>

          <Form.Item
            name="expires_in"
            rules={[{ required: true, message: "Escolha uma data" }]}
          >
            <DatePicker placeholder="Data de expiração" />
          </Form.Item>

          <Form.Item
            name="description"
            rules={[{ required: true, message: "Insira uma descrição" }]}
          >
            <InputTextArea
              placeholder="Descrição da notícia"
              title="Descrição da notícia"
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
