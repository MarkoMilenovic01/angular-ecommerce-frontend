import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route } from '@angular/router';
import { CartItem } from 'src/app/common/cart-item';
import { Product } from 'src/app/common/product';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {



  products : Product[] = [];
  currentCategoryId: number = 1;
  currentCategory : string ="";
  searchMode : boolean = false;
  thePageNumber : number = 1;
  thePageSize: number = 5;
  theTotalElements: number = 0;

  previousKeyword : string = "";

  constructor(private productService : ProductService,private cartService: CartService, private route : ActivatedRoute) { }

  ngOnInit(): void {

    this.route.paramMap.subscribe(() => {
      this.handleListProducts();
    });
    
  }

  handleListProducts(){
    this.searchMode = this.route.snapshot.paramMap.has('keyword');
    if(this.searchMode){
      this.listProductsBySearch();
    }else{
      this.listProductsByCategory();
    }
  }


  listProductsByCategory(){

    const hasCategoryId : boolean = this.route.snapshot.paramMap.has('id');

    if(hasCategoryId){
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id')!;
      this.currentCategory = this.route.snapshot.paramMap.get('name')!;
    }else{
      this.currentCategoryId = 1;
      this.currentCategory = "Books";
    }

    this.productService.getProductListByCategoryIdPaginate(this.thePageNumber - 1, this.thePageSize, this.currentCategoryId).subscribe(
      data => {
        this.products = data._embedded.products;
        this.thePageNumber = data.page.number + 1;
        this.thePageSize = data.page.size;
        this.theTotalElements = data.page.totalElements
      }
    );
  }

  listProductsBySearch(){
    const theKeyword : string = this.route.snapshot.paramMap.get('keyword')!;

    if(this.previousKeyword != theKeyword){
      this.thePageNumber = 1;
    }

    this.previousKeyword = theKeyword;

    console.log(`Keyword = ${theKeyword}, thePageNumber=${this.thePageNumber}`);

    this.productService.getProductListBySearchPaginate(theKeyword, this.thePageNumber - 1, this.thePageSize).subscribe(
      data => {
        this.products = data._embedded.products;
        this.thePageNumber = data.page.number + 1;
        this.thePageSize = data.page.size;
        this.theTotalElements = data.page.totalElements;
      }
    )

  }


  updatePageSize(pageSize: string) {
    this.thePageSize = +pageSize;
    this.thePageNumber = 1;
    this.handleListProducts();
  }

  addToCart(product: Product) {
    console.log(`Adding to cart ${product.name}, ${product.unitPrice}`);

    const cartItem = new CartItem(product);

    this.cartService.addToCart(cartItem);
  }




}
