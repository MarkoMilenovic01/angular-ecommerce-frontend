import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Product } from '../common/product';
import { ProductCategory } from '../common/product-category';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private productsUrl = 'http://localhost:8080/api/products';
  private productCategoriesUrl = 'http://localhost:8080/api/product-category';

  constructor(private httpClient : HttpClient) { }


  getProductListByCategoryIdPaginate(thePage: number, thePageSize: number, categoryId : number) : Observable<ProductGetResponse>{

    const getProductsByCategoryUrlPaginate = `${this.productsUrl}/search/findByCategoryId?id=${categoryId}&page=${thePage}&size=${thePageSize}`;
    
    return this.httpClient.get<ProductGetResponse>(getProductsByCategoryUrlPaginate);
  }

  

  getProductCategories() : Observable<ProductCategory[]>{
    return this.httpClient.get<ProductCategoryGetResponse>(this.productCategoriesUrl).pipe(
      map(response => response._embedded.productCategory)
    )
  }

  getProductListBySearchPaginate(name : String, thePage: number, thePageSize: number) : Observable<ProductGetResponse>{
    const getProductsByContainingNameUrlPaginate = `${this.productsUrl}/search/findByNameContaining?name=${name}&page=${thePage}&size=${thePageSize}`;

    return this.httpClient.get<ProductGetResponse>(getProductsByContainingNameUrlPaginate);
  }


  getProduct(id : number) : Observable<Product>{
    const getProductByIdUrl = `${this.productsUrl}/${id}`;
    return this.httpClient.get<Product>(getProductByIdUrl);
  }
}

interface ProductGetResponse {
  _embedded: {
    products : Product[]; 
  };
  page: {
    size: number,
    totalElements: number,
    totalPages: number,
    number: number
  };
  
}

interface ProductCategoryGetResponse {
  _embedded: {
    productCategory : ProductCategory[];
  }
}
