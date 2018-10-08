import request from "@/utils/request";

export function getCategoriesByProjectIdAndCategoryType(projectId,categoryType) {
  return request({
    method: 'GET',
    url: '/category/list',
    params: {
      projectId: projectId,
      categoryType: categoryType
    }
  })
}

export function addCategory(data) {
  return request({
    method: 'POST',
    url: '/category/add',
    data: data
  })
}

