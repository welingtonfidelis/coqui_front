import { Spin, Pagination, Empty, Form } from "antd";
import React, { useEffect, useRef, useState } from "react";
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
  const [seletedUpdate, setSelectedUpdate] = useState<
    SystemUserItemReducerInterface | {}
  >({});
  const [descriptionSearch, setDescriptionSearch] = useState("");
  const [showModal, setShowModal] = useState(false);

  const dispatch = useDispatch();

  const systemUserListOnReducer = useSelector(
    (state: { systemUser: SystemUserListReducerInterface }) => state.systemUser
  );
  const url = "/cash-register-groups";

  useEffect(() => {
    getCashRegisterGroupList();
  }, [page, limit, reloadList]);

  const getCashRegisterGroupList = async () => {
    dispatch(systemUserStartListLoading());

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

    const users = [];
    for (let i = 1; i <= 15; i += 1) {
      users.push({
        id: 1 + "",
        name: `Usuário Fulano ${i}`,
        email: `usuario_${i}@email.com`,
        user: `usuario${1}`,
        companyName: "Tofu Queijos Litd",
        birth: new Date(`${i}/07/1990`),
        profileImage:
          "https://conversa-aqui.s3.sa-east-1.amazonaws.com/user-images/beaver.png",
        phone: `35 9 9999-83${(i + "").padStart(2, "0")}`,
        address: `Rua Alpha dos Maia, Nº ${i}, Brasília - DF`,
        active: Math.floor(Math.random() * 2) > 0,
        created_at: new Date(),
        updated_at: new Date(),
      });

      setTotal(users.length);
    }
    setTimeout(() => {
      dispatch(systemUserUpdateList(users));

      dispatch(systemUserStopListLoading());
    }, 1000);
  };

  const handleSaveSystemUser = async (values: any) => {
    dispatch(systemUserStartSaveLoading());

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

      dispatch(systemUserStopSaveLoading());
      setShowModal(false);
      setSelectedUpdate({});
    }, 2000);
  };

  const handleSelectSystemUser = (index: number) => {
    setSelectedUpdate(systemUserListOnReducer.list[index]);

    setShowModal(true);
  };

  const handleSearchCashRegisterGroup = (description: string) => {
    setDescriptionSearch(description);
    setPage(1);
    setReloadList(reloadList + 1);
  };

  const handleDeleteSystemUser = async (index: number) => {
    dispatch(systemUserStartItemActionLoading(index));

    console.log("delete");

    // const { id } = systemUserListOnReducer.list[index];

    // const { ok } = await deleteService({
    //     id,
    //     url,
    // });

    setTimeout(() => {
      dispatch(systemUserStopItemActionLoading(index));
    }, 2000);

    // if(ok) setReloadList(reloadList + 1);
  };

  const handleChangeStatusSystemUser = async (index: number) => {
    dispatch(systemUserStartItemActionLoading(index));

    console.log("change status");

    // const { id } = systemUserListOnReducer.list[index];

    // const { ok } = await deleteService({
    //     id,
    //     url,
    // });

    setTimeout(() => {
      dispatch(systemUserStopItemActionLoading(index));
    }, 2000);

    // if(ok) setReloadList(reloadList + 1);
  };

  const handleCloseModalProfile = () => {
    setShowModal(false);
    setSelectedUpdate({});
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
                  icon={item.profileImage && <img src={item.profileImage} alt="" />}
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
