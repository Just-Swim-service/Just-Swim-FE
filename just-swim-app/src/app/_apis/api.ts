const api = async (
  url: string,
  options: RequestInit = {},
): Promise<Response> => {
  const base = `${process.env.API_PATH}/api`;
  /*
    
  추후 프로덕션인지 dev 인지에 따라 다른 ENV 사용하도록 수정 - 배포 전에 해결해야함 
  
  */
  // process.env.NODE_ENV === 'production'
  //   ? process.env.NEXT_PUBLIC_PROD_API_URL
  //   : process.env.NEXT_PUBLIC_DEV_API_URL;

  const fullUrl = `${base}${url}`;
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    credentials: 'include',
  };
  const finalOptions = { ...defaultOptions, ...options };

  return await fetch(fullUrl, finalOptions);
};

export default api;
