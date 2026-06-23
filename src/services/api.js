const API_URL = 'https://fefu2026spring.deploy.feip.dev/catalog';
const TOKEN = 'Cmt7wdwFgDIi1_SRX8hlJIExs0jJKPr4axflLpExAxM';

export const fetchCatalog = async () => {
  const response = await fetch(API_URL, {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Ошибка загрузки: ${response.status}`);
  }

  const data = await response.json();
  return data;
};