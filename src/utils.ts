// Utillity Helper FN : 이미지 경로를 만들어 주는 함수
export function makeImagePath(id:string, format?:string){
  // format?:string -> ex) w500(이미지 가로 사이즈)
  return `https://image.tmdb.org/t/p/${format? format: 'original'}/${id}`;

}