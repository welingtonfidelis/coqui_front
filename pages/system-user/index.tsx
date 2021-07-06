import { Spin, Pagination, Empty, Form } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ButtonPrimary } from '../../components/button';
import { Input, InputSearch, InputTextArea } from '../../components/input';
import { ListItem } from '../../components/listItem';
import { Modal } from '../../components/modal';
import { SystemUserListReducerInterface } from '../../store/systemUser/model';
import {
    postService, deleteService, getService, putService 
} from '../../services/apiRequest';
import { systemUserStartItemActionLoading, systemUserStartListLoading, systemUserStartSaveLoading, systemUserStopItemActionLoading, systemUserStopListLoading, systemUserStopSaveLoading, systemUserUpdateList } from '../../store/systemUser/actions';

export default function SystemUser() {
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [total, setTotal] = useState(0);
    const [reloadList, setReloadList] = useState(0);
    const [seletedUpdate, setSelectedUpdate] = useState('');
    const [descriptionSearch, setDescriptionSearch] = useState('');
    const [showModal, setShowModal] = useState(false);

    const [form] = Form.useForm();
    const buttonRef = useRef(null)
    const dispatch = useDispatch();

    const systemUserListOnReducer = useSelector(
        (state: { systemUser: SystemUserListReducerInterface }) => state.systemUser
    );
    const url = '/cash-register-groups';

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

        dispatch(systemUserStopListLoading());
    }

    const handleSaveCashRegisterGroup = async (values: any) => {
        dispatch(systemUserStartSaveLoading());

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

        dispatch(systemUserStopSaveLoading());

        if(noErrors) {
            handleClearForm();
    
            setReloadList(reloadList + 1);
        }
    }

    const handleSelectCashRegisterGroup = (index: number) => {
        const { 
            id, active, name, birth, companyName, email, profileImage,
            user, phone
        } = systemUserListOnReducer.list[index];

        setSelectedUpdate(id);

        form.setFieldsValue({
            active, name, birth, companyName, email, 
            profileImage, user, phone
        });

        setShowModal(true);
    }

    const handleSearchCashRegisterGroup = (description: string) => {
        setDescriptionSearch(description);
        setPage(1);
        setReloadList(reloadList +1);
    }

    const handleDeleteCashRegisterGroup = async (index: number) => {
        dispatch(systemUserStartItemActionLoading(index));

        // const { id } = systemUserListOnReducer.list[index];

        // const { ok } = await deleteService({
        //     id, 
        //     url,
        // });

        dispatch(systemUserStopItemActionLoading(index));

        // if(ok) setReloadList(reloadList + 1);
    }

    const handleClearForm = () => {
        setShowModal(false)
        form.resetFields();
        setSelectedUpdate('');
    }

    return (
        <div id="system-user-page">
            <Spin spinning={systemUserListOnReducer.loadingList}>
                <div className="system-user-search">
                    <InputSearch
                        placeholder="Nome do usuário"
                        onSearch={(e) => handleSearchCashRegisterGroup(e)}
                    />

                    <ButtonPrimary onClick={() => setShowModal(true)}>
                        Novo
                    </ButtonPrimary>
                </div>

                <div className="system-user-list">
                    {
                        total > 0
                            ? systemUserListOnReducer.list.map((item, index) => (
                                <h2>{item.name}</h2>
                                // <ListItem
                                //     key={index}
                                //     title={item.description}
                                //     onEdit={() => handleSelectCashRegisterGroup(index)}
                                //     onDelete={() => handleDeleteCashRegisterGroup(index)}
                                //     onDeleteLoad={item.loadingDelete}
                                // />
                            ))

                            : <Empty description="Esta lista está vazia." />
                    }
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
                title="Novo grupo para registro de caixa"
                isVisible={showModal}
                onOk={() => { buttonRef.current.click() }}
                onCancel={handleClearForm}
                confirmLoading={systemUserListOnReducer.loadingSave}
            >
                <Form
                    onFinish={handleSaveCashRegisterGroup}
                    form={form}
                >
                    <Form.Item
                        name="description"
                        rules={[{ required: true, message: "Insira uma descrição" }]}
                    >
                        <Input
                            placeholder="Descrição"
                        />
                    </Form.Item>

                    <Form.Item
                        name="observation"
                    >
                        <InputTextArea
                            placeholder="Observação"
                        />
                    </Form.Item>

                    <button ref={buttonRef} type="submit" hidden />
                </Form>
            </Modal>
        </div>
    )
}