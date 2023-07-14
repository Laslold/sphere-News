import axios from 'axios';
const BASE_URL = 'https://pixabay.com/api';

const instance = axios.create({
  baseURL: BASE_URL,
});

export const getItems = async (query = '', page = 1) => {
  try {
    const { data } = await instance.get('/', {
      params: {
        key: '33320423-fc6a84bdab9b582d6d8de3308',
        q: query,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: 'true',
        per_page: 40,
        page,
      },
    });

    return data;
  } catch (error) {
    return false;
  }
};
