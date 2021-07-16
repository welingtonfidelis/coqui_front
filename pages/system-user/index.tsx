import { Spin, Pagination, Empty } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ButtonPrimary } from "../../components/button";
import { InputSearch } from "../../components/input";
import { ModalProfile } from "../../components/modalProfile";
import { ModalAlert } from "../../components/modalAlert";
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
import { ROLES_ENUM } from "../../enums/role";
import { UserReducerInterface } from "../../store/user/model";
import { Socket } from "socket.io-client";

interface Props {
  socket: Socket;
}

interface NewUserData {
  email: string;
  id: string;
  name: string;
  password: string;
  profile_image: string;
  user: string;
}

export default function SystemUser(props: Props) {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [reloadList, setReloadList] = useState(0);
  const [seletedUpdate, setSelectedUpdate] =
    useState<SystemUserItemReducerInterface>(null);
  const [userNameSearch, setUserNameSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showModalAlert, setShowModalAlert] = useState(false);
  const [newUserData, setNewUserData] = useState<NewUserData>(null);

  const dispatch = useDispatch();

  const systemUserListOnReducer = useSelector(
    (state: { systemUser: SystemUserListReducerInterface }) => state.systemUser
  );
  const userOnReducer = useSelector(
    (state: { user: UserReducerInterface }) => state.user
  );

  const { socket } = props;
  const url = "/users";
  const roleList = [
    { value: ROLES_ENUM.USER, description: "USUÁRIO" },
    { value: ROLES_ENUM.MANAGER, description: "GERENTE" },
  ];

  if (userOnReducer.role === ROLES_ENUM.ADMIN) {
    roleList.push({ value: ROLES_ENUM.ADMIN, description: "ADMINISTRADOR" });
  }

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
      const { ok, data } = await postService({
        url,
        values: { ...values, active: true },
      });

      if (socket) {
        socket.emit("new_user", data);
      }

      setNewUserData(data);
      setShowModalAlert(true);

      noErrors = ok;
    }

    if (noErrors) {
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

    if (ok) {
      if (socket) {
        socket.emit("deleted_user", { id });
      }

      setReloadList(reloadList + 1);
    }

    dispatch(systemUserStopItemActionLoading(index));
  };

  const handleChangeStatusSystemUser = async (index: number) => {
    dispatch(systemUserStartItemActionLoading(index));

    const { id, active } = systemUserListOnReducer.list[index];

    const { ok } = await patchService({
      id,
      url,
      urlComplement: "/status",
      values: { status: !active },
    });

    if (ok) {
      if (socket && active) {
        socket.emit("deleted_user", { id });
      }

      setReloadList(reloadList + 1);
    }

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

        {total > 0 ? (
          <main>
            <div className="system-user-list">
              {systemUserListOnReducer.list.map((item, index) => {
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
                      item.profileImage && (
                        <img src={item.profileImage} alt="" />
                      )
                    }
                    onEdit={() => handleSelectSystemUser(index)}
                    onChangeStatus={() => handleChangeStatusSystemUser(index)}
                    onDelete={() => handleDeleteSystemUser(index)}
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
      <ModalProfile
        isVisible={showModal}
        loading={systemUserListOnReducer.loadingSave}
        onCancel={handleCloseModalProfile}
        onOk={handleSaveSystemUser}
        roleList={roleList}
        {...seletedUpdate}
      />

      <ModalAlert
        isVisible={showModalAlert}
        type={"success"}
        onOk={() => setShowModalAlert(false)}
        title="Criado com sucesso!"
        subtitle="O novo usuário foi criado com sucesso. Abaixo estão as informações para seu primeiro acesso ao sistema."
      >
        {newUserData && (
          <>
            <br /> Usuário: <strong>{newUserData.user}</strong>
            <br /> Email: <strong>{newUserData.email}</strong>
            <br /> Senha: <strong>{newUserData.password}</strong>
            <p />
            <p>
              <strong>IMPORTANTE:</strong> O usuário deve atualizar esta senha o
              mais breve possível através de seu perfil no sistema.
            </p>
          </>
        )}
      </ModalAlert>
    </div>
  );
}
