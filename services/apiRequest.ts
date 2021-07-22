import { LOCAL_STORAGE_ENUM } from "../components/enums/localStorage";
import { Notification } from "../components/notification";
import { api } from "./api";

const DEFAULT_SUCCESS_MESSAGE = {
  title: "Sucesso!",
  message: "Requisição efetuada com sucesso.",
};
const DEFAULT_ERROR_MESSAGE = {
  title: "Falha!",
  message: "Houve um erro ao executar esta ação, por favor, tente novamente.",
};

interface NotificationMessage {
  title: string;
  message: string;
}

interface RequestInterface {
  url: string;
  errorMessage?: NotificationMessage;
  successMessage?: NotificationMessage;
  validationToken?: boolean;
}

interface ListInterface extends RequestInterface {
  limit?: number;
  page?: number;
}

interface CreateInterface extends RequestInterface {
  values: object;
}

interface UpdateInterface extends RequestInterface {
  id: string;
  values: object;
  urlComplement?: string;
}

interface DeleteInterface extends RequestInterface {
  id: string;
}

interface ResponseDataInterface {
  ok: boolean;
  data: any;
}

export const getService = async (props: ListInterface) => {
  const returnedValues: ResponseDataInterface = { ok: false, data: {} };

  const url = props.url;

  delete props.url;

  try {
    const Authorization = getAuthorization();
    const response = await api.get(url, {
      params: { ...props },
      headers: { Authorization },
    });

    const { data: dataResponse } = response;
    const { data } = dataResponse;

    returnedValues.ok = true;
    returnedValues.data = data;
  } catch (error) {
    const message = props.errorMessage?.title || DEFAULT_ERROR_MESSAGE.title;
    const description =
      props.errorMessage?.message || DEFAULT_ERROR_MESSAGE.message;

    Notification({
      type: "error",
      message,
      description,
      statusCode: error?.response?.status,
      validationToken: props.validationToken ?? true,
    });
  } finally {
    return returnedValues;
  }
};

export const downloadFileBufferService = async (
  props: ListInterface,
  fileName: string
) => {
  const url = props.url;

  delete props.url;

  try {
    const Authorization = getAuthorization();
    const response = await api.get(url, {
      params: { ...props },
      headers: { Authorization },
      responseType: "blob",
    });

    const { data } = response;

    //open file in new tab
    // const file = new Blob([data], { type: 'application/pdf'});
    // const fileURL = URL.createObjectURL(file);
    // window.open(fileURL);

    //download file
    const tmpUrl = window.URL.createObjectURL(new Blob([data]));
    const link = document.createElement("a");
    link.href = tmpUrl;
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    link.remove();

    const message =
      props.successMessage?.title || DEFAULT_SUCCESS_MESSAGE.title;
    const description =
      props.successMessage?.message || DEFAULT_SUCCESS_MESSAGE.message;

    Notification({
      type: "success",
      message,
      description,
      validationToken: false,
    });
  } catch (error) {
    const message = props.errorMessage?.title || DEFAULT_ERROR_MESSAGE.title;
    const description =
      props.errorMessage?.message || DEFAULT_ERROR_MESSAGE.message;

    Notification({
      type: "error",
      message,
      description,
      statusCode: error?.response?.status,
      validationToken: props.validationToken ?? true,
    });
  }
};

export const postService = async (props: CreateInterface) => {
  const returnedValues: ResponseDataInterface = { ok: false, data: {} };

  try {
    const Authorization = getAuthorization();
    const response = await api.post(props.url, props.values, {
      headers: { Authorization },
    });

    const { data: dataResponse } = response;
    const { data } = dataResponse;

    returnedValues.data = data;
    returnedValues.ok = true;

    const message =
      props.successMessage?.title || DEFAULT_SUCCESS_MESSAGE.title;
    const description =
      props.successMessage?.message || DEFAULT_SUCCESS_MESSAGE.message;

    Notification({
      type: "success",
      message,
      description,
      validationToken: false,
    });
  } catch (error) {
    const message = props.errorMessage?.title || DEFAULT_ERROR_MESSAGE.title;
    const description =
      props.errorMessage?.message || DEFAULT_ERROR_MESSAGE.message;

    Notification({
      type: "error",
      message,
      description,
      statusCode: error?.response?.status,
      validationToken: props.validationToken ?? true,
    });
  } finally {
    return returnedValues;
  }
};

export const putService = async (props: UpdateInterface) => {
  const returnedValues: ResponseDataInterface = { ok: false, data: {} };

  try {
    const Authorization = getAuthorization();
    const url = `${props.url}/${props.id}${props.urlComplement ? props.urlComplement : ''}`;
    const response = await api.put(url, props.values, {
      headers: { Authorization },
    });

    const { data: dataResponse } = response;
    const { data } = dataResponse;

    returnedValues.data = data;
    returnedValues.ok = true;

    const message =
      props.successMessage?.title || DEFAULT_SUCCESS_MESSAGE.title;
    const description =
      props.successMessage?.message || DEFAULT_SUCCESS_MESSAGE.message;

    Notification({
      type: "success",
      message,
      description,
      validationToken: false,
    });
  } catch (error) {
    const message = props.errorMessage?.title || DEFAULT_ERROR_MESSAGE.title;
    const description =
      props.errorMessage?.message || DEFAULT_ERROR_MESSAGE.message;

    Notification({
      type: "error",
      message,
      description,
      statusCode: error?.response?.status,
      validationToken: props.validationToken ?? true,
    });
  } finally {
    return returnedValues;
  }
};

export const patchService = async (props: UpdateInterface) => {
  const returnedValues: ResponseDataInterface = { ok: false, data: {} };

  try {
    const Authorization = getAuthorization();
    const url = `${props.url}/${props.id}${props.urlComplement ? props.urlComplement : ''}`;
    const response = await api.patch(url, props.values, {
      headers: { Authorization },
    });

    const { data: dataResponse } = response;
    const { data } = dataResponse;

    returnedValues.data = data;
    returnedValues.ok = true;

    const message =
      props.successMessage?.title || DEFAULT_SUCCESS_MESSAGE.title;
    const description =
      props.successMessage?.message || DEFAULT_SUCCESS_MESSAGE.message;

    Notification({
      type: "success",
      message,
      description,
      validationToken: false,
    });
  } catch (error) {
    const message = props.errorMessage?.title || DEFAULT_ERROR_MESSAGE.title;
    const description =
      props.errorMessage?.message || DEFAULT_ERROR_MESSAGE.message;

    Notification({
      type: "error",
      message,
      description,
      statusCode: error?.response?.status,
      validationToken: props.validationToken ?? true,
    });
  } finally {
    return returnedValues;
  }
};

export const deleteService = async (props: DeleteInterface) => {
  const returnedValues: ResponseDataInterface = { ok: false, data: {} };

  try {
    const Authorization = getAuthorization();
    const response = await api.delete(`${props.url}/${props.id}`, {
      headers: { Authorization },
    });

    const { data: dataResponse } = response;
    const { data } = dataResponse;

    returnedValues.data = data;
    returnedValues.ok = true;

    const message =
      props.successMessage?.title || DEFAULT_SUCCESS_MESSAGE.title;
    const description =
      props.successMessage?.message || DEFAULT_SUCCESS_MESSAGE.message;

    Notification({
      type: "success",
      message,
      description,
      validationToken: false,
    });
  } catch (error) {
    const message = props.errorMessage?.title || DEFAULT_ERROR_MESSAGE.title;
    const description =
      props.errorMessage?.message || DEFAULT_ERROR_MESSAGE.message;

    Notification({
      type: "error",
      message,
      description,
      statusCode: error?.response?.status,
      validationToken: props.validationToken ?? true,
    });
  } finally {
    return returnedValues;
  }
};

const getAuthorization = () => {
  return localStorage.getItem(LOCAL_STORAGE_ENUM.TOKEN);
};
