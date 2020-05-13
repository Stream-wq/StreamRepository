// import {uploadFiles} from "../api/axios";

import Axios from "axios";


function uploadFile(file) {
  return new Promise(((resolve, reject) => {
    const data = new FormData();
    data.append('file', file);
    data.append('file_type', file.type);
    Axios.post("/bcbuyerapihttp/uploadfile/upload", data).then(res => {
      if (res.status == 200) {
        resolve(res.data)
      }
    })
  }))

}

export default uploadFile
