import { Spin, Pagination, Empty } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ButtonPrimary } from "../../components/button";
import { InputSearch } from "../../components/input";
import { ModalCompany } from "../../components/modalCompany";
import { ModalAlert } from "../../components/modalAlert";
import { ListItem } from "../../components/listItem";
import {
  CompanyItemReducerInterface,
  CompanyListReducerInterface,
} from "../../store/company/model";
import {
  postService,
  deleteService,
  getService,
  putService,
  patchService,
} from "../../services/apiRequest";
import {
  companyStartItemActionLoading,
  companyStartListLoading,
  companyStartSaveLoading,
  companyStopItemActionLoading,
  companyStopListLoading,
  companyStopSaveLoading,
  companyUpdateList,
} from "../../store/company/actions";
import { FaBan, FaCheckCircle, FaStoreAlt } from "react-icons/fa";
import { ROLES_ENUM } from "../../enums/role";
import { UserReducerInterface } from "../../store/user/model";

interface Props {
}

interface NewUserData {
  email: string;
  id: string;
  name: string;
  password: string;
  profile_image: string;
  user: string;
}

export default function Company(props: Props) {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [reloadList, setReloadList] = useState(0);
  const [seletedUpdate, setSelectedUpdate] =
    useState<CompanyItemReducerInterface>(null);
  const [userNameSearch, setUserNameSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showModalAlert, setShowModalAlert] = useState(false);
  const [newUserData, setNewUserData] = useState<NewUserData>(null);

  const dispatch = useDispatch();

  const companyListOnReducer = useSelector(
    (state: { company: CompanyListReducerInterface }) => state.company
  );
  const userOnReducer = useSelector(
    (state: { user: UserReducerInterface }) => state.user
  );

  const url = "/companies";
  const roleList = [
    { value: ROLES_ENUM.USER, description: "USUÁRIO" },
    { value: ROLES_ENUM.MANAGER, description: "GERENTE" },
  ];

  if (userOnReducer.role === ROLES_ENUM.ADMIN) {
    roleList.push({ value: ROLES_ENUM.ADMIN, description: "ADMINISTRADOR" });
  }

  useEffect(() => {
    getCompanyList();
  }, [page, limit, reloadList]);

  const getCompanyList = async () => {
    dispatch(companyStartListLoading());

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
        companyUpdateList(
          rows.map((item) => ({ ...item, profileImage: item.profile_image }))
        )
      );
      setTotal(count);
    }

    dispatch(companyStopListLoading());
  };

  const handleSavecompany = async (values: any) => {
    dispatch(companyStartSaveLoading());

    let noErrors = false;

    if (seletedUpdate) {
      values.active = seletedUpdate.active;
      values.logo = seletedUpdate.logo;
      const { ok } = await putService({
        id: seletedUpdate.id,
        url,
        values,
      });

      noErrors = ok;
    } else {
      const { ok, data } = await postService({
        url,
        values: { ...values, active: true, logo: null },
      });

      noErrors = ok;
      
      if(noErrors) {
        setNewUserData(data.user);
        setShowModalAlert(true);
      }
    }

    if (noErrors) {
      handleCloseModalCompany();
      setReloadList(reloadList + 1);
    }

    dispatch(companyStopSaveLoading());
  };

  const handleSelectcompany = (index: number) => {
    setSelectedUpdate(companyListOnReducer.list[index]);

    setShowModal(true);
  };

  const handleSearchCashRegisterGroup = (description: string) => {
    setUserNameSearch(description);
    setPage(1);
    setReloadList(reloadList + 1);
  };

  const handleDeletecompany = async (index: number) => {
    dispatch(companyStartItemActionLoading(index));

    const { id } = companyListOnReducer.list[index];

    const { ok } = await deleteService({
      id,
      url,
    });

    if(ok) setReloadList(reloadList + 1);

    dispatch(companyStopItemActionLoading(index));
  };

  const handleChangeStatuscompany = async (index: number) => {
    dispatch(companyStartItemActionLoading(index));

    const { id, active } = companyListOnReducer.list[index];

    const { ok } = await patchService({
      id,
      url,
      urlComplement: "/status",
      values: { status: !active },
    });

    if (ok) {
      setReloadList(reloadList + 1);
    }

    dispatch(companyStopItemActionLoading(index));
  };

  const handleCloseModalCompany = () => {
    setShowModal(false);
    setSelectedUpdate(null);
  };

  return (
    <div id="system-user-page">
      <Spin spinning={companyListOnReducer.loadingList}>
        <div className="system-user-search">
          <InputSearch
            placeholder="Nome da empresa"
            onSearch={(e) => handleSearchCashRegisterGroup(e)}
          />

          <ButtonPrimary onClick={() => setShowModal(true)}>Novo</ButtonPrimary>
        </div>

        {total > 0 ? (
          <main>
            <div className="system-user-list">
              {companyListOnReducer.list.map((item, index) => {
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
                      item.logo ? <img src={item.logo} alt="" />
                      : < FaStoreAlt/>
                    }
                    onEdit={() => handleSelectcompany(index)}
                    onChangeStatus={() => handleChangeStatuscompany(index)}
                    onDelete={() => handleDeletecompany(index)}
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
      <ModalCompany
        isVisible={showModal}
        loading={companyListOnReducer.loadingSave}
        onCancel={handleCloseModalCompany}
        onOk={handleSavecompany}
        {...seletedUpdate}
      />

      <ModalAlert
        isVisible={showModalAlert}
        type={"success"}
        onOk={() => setShowModalAlert(false)}
        title="Criado com sucesso!"
        subtitle="A nova empresa foi criada com sucesso. Abaixo estão as informações para seu primeiro acesso ao sistema."
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
