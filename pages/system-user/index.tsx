import { Spin, Pagination, Empty } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ButtonPrimary } from "../../components/button";
import { InputSearch } from "../../components/input";
import { ModalProfile } from "../../components/modalProfile";
import { ListItem } from "../../components/listItem";
import {
  SystemUserItemReducerInterface,
  SystemUserListReducerInterface,
} from "../../store/systemUser/model";
import {
  postService,
  deleteService,
  getService,
  putService,
  patchService,
} from "../../services/apiRequest";
import {
  systemUserStartItemActionLoading,
  systemUserStartListLoading,
  systemUserStartSaveLoading,
  systemUserStopItemActionLoading,
  systemUserStopListLoading,
  systemUserStopSaveLoading,
  systemUserUpdateList,
} from "../../store/systemUser/actions";
import { FaBan, FaCheckCircle } from "react-icons/fa";

export default function SystemUser() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [reloadList, setReloadList] = useState(0);
  const [seletedUpdate, setSelectedUpdate] =
    useState<SystemUserItemReducerInterface>(null);
  const [userNameSearch, setUserNameSearch] = useState("");
  const [showModal, setShowModal] = useState(false);

  const dispatch = useDispatch();

  const systemUserListOnReducer = useSelector(
    (state: { systemUser: SystemUserListReducerInterface }) => state.systemUser
  );
  const url = "/users";

  useEffect(() => {
    getSystemUserList();
  }, [page, limit, reloadList]);

  const getSystemUserList = async () => {
    dispatch(systemUserStartListLoading());

    const props = {
      url,
      limit,
      page,
      name: null,
    };

    if (userNameSearch.length > 2) props.name = userNameSearch;

    const { ok, data } = await getService(props);
    if (ok) {
      const { rows, count } = data;

      dispatch(
        systemUserUpdateList(
          rows.map((item) => ({ ...item, profileImage: item.profile_image }))
        )
      );
      setTotal(count);
    }

    dispatch(systemUserStopListLoading());
  };

  const handleSaveSystemUser = async (values: any) => {
    dispatch(systemUserStartSaveLoading());

    let noErrors = false;

    if (seletedUpdate) {
      values.active = seletedUpdate.active;
      const { ok } = await putService({
        id: seletedUpdate.id,
        url,
        values,
      });

      noErrors = ok;
    } else {
      const { ok } = await postService({
        url,
        values: { ...values, active: true },
      });

      noErrors = ok;
    }

    if(noErrors) {
      handleCloseModalProfile();
      setReloadList(reloadList + 1);
    }

    dispatch(systemUserStopSaveLoading());
  };

  const handleSelectSystemUser = (index: number) => {
    setSelectedUpdate(systemUserListOnReducer.list[index]);

    setShowModal(true);
  };

  const handleSearchCashRegisterGroup = (description: string) => {
    setUserNameSearch(description);
    setPage(1);
    setReloadList(reloadList + 1);
  };

  const handleDeleteSystemUser = async (index: number) => {
    dispatch(systemUserStartItemActionLoading(index));

    const { id } = systemUserListOnReducer.list[index];

    const { ok } = await deleteService({
        id,
        url,
    });
    
    if(ok) setReloadList(reloadList + 1);

    dispatch(systemUserStopItemActionLoading(index));
  };

  const handleChangeStatusSystemUser = async (index: number) => {
    dispatch(systemUserStartItemActionLoading(index));

    const { id, active } = systemUserListOnReducer.list[index];

    const { ok } = await patchService({
        id,
        url,
        urlComplement: '/status',
        values: { status: !active }
    });
    
    if(ok) setReloadList(reloadList + 1);

    dispatch(systemUserStopItemActionLoading(index));
  };

  const handleCloseModalProfile = () => {
    setShowModal(false);
    setSelectedUpdate(null);
  };

  return (
    <div id="system-user-page">
      <Spin spinning={systemUserListOnReducer.loadingList}>
        <div className="system-user-search">
          <InputSearch
            placeholder="Nome do usuário"
            onSearch={(e) => handleSearchCashRegisterGroup(e)}
          />

          <ButtonPrimary onClick={() => setShowModal(true)}>Novo</ButtonPrimary>
        </div>

        <div className="system-user-list">
          {total > 0 ? (
            systemUserListOnReducer.list.map((item, index) => {
              const subtitle = item.active ? (
                <>
                  <FaCheckCircle color="green" /> <span>Ativo</span>
                </>
              ) : (
                <>
                  <FaBan color="yellow" /> <span>Inativo</span>
                </>
              );

              return (
                <ListItem
                  key={index + ""}
                  title={item.name}
                  subtitle={subtitle}
                  activeItem={item.active}
                  icon={
                    item.profileImage && <img src={item.profileImage} alt="" />
                  }
                  onEdit={() => handleSelectSystemUser(index)}
                  onChangeStatus={() => handleChangeStatusSystemUser(index)}
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

      <ModalProfile
        isVisible={showModal}
        loading={systemUserListOnReducer.loadingSave}
        onCancel={handleCloseModalProfile}
        onOk={handleSaveSystemUser}
        {...seletedUpdate}
      />
    </div>
  );
}
