import { Spin, Pagination, Empty, Form } from "antd";
import React, { useEffect, useRef, useState } from "react";
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
import { FaBan, FaCheckCircle } from "react-icons/fa";
import {
  NewsItemReducerInterface,
  NewsListReducerInterface,
} from "../../store/newsEdit/model";
import {
  newsStartItemActionLoading,
  newsStartListLoading,
  newsStartSaveLoading,
  newsStopItemActionLoading,
  newsStopListLoading,
  newsStopSaveLoading,
  newsUpdateList,
} from "../../store/newsEdit/actions";
import { maskDate } from "../../util";
import moment from "moment";

export default function SystemUser() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [reloadList, setReloadList] = useState(0);
  const [seletedUpdate, setSelectedUpdate] = useState<
    NewsItemReducerInterface | {}
  >({});
  const [descriptionSearch, setDescriptionSearch] = useState("");
  const [showModal, setShowModal] = useState(false);

  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const newsListOnReducer = useSelector(
    (state: { newsEdit: NewsListReducerInterface }) => state.newsEdit
  );
  const url = "/cash-register-groups";

  useEffect(() => {
    getNewsList();
  }, [page, limit, reloadList]);

  const getNewsList = async () => {
    dispatch(newsStartListLoading());

    // const props = {
    //     url,
    //     limit,
    //     page,
    //     description: null
    // }

    // if(descriptionSearch.length > 2) props.description = descriptionSearch;

    // const { ok, data } = await getService(props);
    // if(ok) {
    //     const { rows, count } = data;

    //     dispatch(systemUserUpdateList(rows));
    //     setTotal(count);
    // }

    const news = [];
    for (let i = 1; i <= 15; i += 1) {
      news.push({
        id: i,
        title: `Notícia ${i}`,
        description: `Notícia ${i} bla bla bla blab lablbalbalbal`,
        image: "",
        expiresIn: new Date(`2021/07/${i}`),
        createdAt: new Date(`2021/06/${i}`),
        loadingItemAction: false,
      });
    }
    setTimeout(() => {
      dispatch(newsUpdateList(news));

      dispatch(newsStopListLoading());

      setTotal(news.length);
    }, 1000);
  };

  const handleSaveNews = async (values: any) => {
    dispatch(newsStartSaveLoading());

    console.log("modal save", values);

    let noErrors = false;

    // if (seletedUpdate !== '') {
    //    const { ok } = await putService({
    //         id: seletedUpdate,
    //         url,
    //         values,
    //     });

    //     noErrors = ok;
    // }
    // else {
    //     const { ok } = await postService({
    //         url,
    //         values,
    //     });

    //     noErrors = ok;
    // }

    setTimeout(() => {
      if (noErrors) {
        setReloadList(reloadList + 1);
      }

      dispatch(newsStopSaveLoading());
      setShowModal(false);
      setSelectedUpdate({});
    }, 2000);
  };

  const handleSelectSystemUser = (index: number) => {
    setSelectedUpdate(newsListOnReducer.list[index]);

    form.setFieldsValue({
      ...newsListOnReducer.list[index], 
      expires_in: moment(newsListOnReducer.list[index].expiresIn)
    });

    setShowModal(true);
  };

  const handleSearch = (description: string) => {
    setDescriptionSearch(description);
    setPage(1);
    setReloadList(reloadList + 1);
  };

  const handleDeleteSystemUser = async (index: number) => {
    dispatch(newsStartItemActionLoading(index));

    console.log("delete");

    // const { id } = newsListOnReducer.list[index];

    // const { ok } = await deleteService({
    //     id,
    //     url,
    // });

    setTimeout(() => {
      dispatch(newsStopItemActionLoading(index));
    }, 2000);

    // if(ok) setReloadList(reloadList + 1);
  };

  const handleCloseModalProfile = () => {
    setShowModal(false);
    setSelectedUpdate({});
    form.setFieldsValue({
      title: '',
      expires_in: '',
      description: ''
    })
  };

  return (
    <div id="system-user-page">
      <Spin spinning={newsListOnReducer.loadingList}>
        <div className="system-user-search">
          <InputSearch
            placeholder="Título da notícia"
            onSearch={(e) => handleSearch(e)}
          />

          <ButtonPrimary onClick={() => setShowModal(true)}>Novo</ButtonPrimary>
        </div>

        <div className="system-user-list">
          {total > 0 ? (
            newsListOnReducer.list.map((item, index) => {
              return (
                <ListItem
                  key={index + ""}
                  title={item.title}
                  subtitle={`Criada em: ${maskDate(
                    item.createdAt
                  )} - Expira em: ${maskDate(item.expiresIn)}`}
                  //   icon={<img src={item.profileImage} alt="" />}
                  onEdit={() => handleSelectSystemUser(index)}
                  onDelete={() => handleDeleteSystemUser(index)}
                  onActionLoad={item.loadingItemAction}
                />
              );
            })
          ) : (
            <Empty description="Esta lista está vazia." />
          )}
        </div>

        <Pagination
          defaultCurrent={page}
          defaultPageSize={limit}
          onChange={(e) => setPage(e)}
          onShowSizeChange={(e, f) => setLimit(f)}
          total={total}
        />
      </Spin>

      <Modal
        title="Notícia"
        isVisible={showModal}
        onOk={() => {
          form.submit();
        }}
        onCancel={handleCloseModalProfile}
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
