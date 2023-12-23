type BaseResponse<T> = {
  data: T;
};

type ApiSuccess<T> = BaseResponse<T> & {
  status: "ok";
};

type ApiError<T> = BaseResponse<T> & {
  status: "error";
  message: string;
};
