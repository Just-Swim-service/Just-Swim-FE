"use server";

export async function uploadProduct(formData: FormData) {
  // console.log(formData.getAll('fileinput'));
}

export async function kakaoLogin(formData: FormData) {
  try {
    const result = await fetch("http://3.38.162.80/api/Oauth/kakao");

    console.log(result);
    
  } catch (error) {
    
  }
}