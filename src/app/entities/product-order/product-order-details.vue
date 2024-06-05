<template>
  <div class="row justify-content-center">
    <div class="col-8">
      <div v-if="productOrder">
        <h2 class="jh-entity-heading" data-cy="productOrderDetailsHeading">
          <span v-text="t$('boutiqueApp.productOrder.detail.title')"></span> {{ productOrder.id }}
        </h2>
        <dl class="row jh-entity-details">
          <dt>
            <span v-text="t$('boutiqueApp.productOrder.quantity')"></span>
          </dt>
          <dd>
            <span>{{ productOrder.quantity }}</span>
          </dd>
          <dt>
            <span v-text="t$('boutiqueApp.productOrder.totalPrice')"></span>
          </dt>
          <dd>
            <span>{{ productOrder.totalPrice }}</span>
          </dd>
          <dt>
            <span v-text="t$('boutiqueApp.productOrder.product')"></span>
          </dt>
          <dd>
            <div v-if="productOrder.product">
              <router-link :to="{ name: 'ProductView', params: { productId: productOrder.product.id } }">{{
                productOrder.product.name
              }}</router-link>
            </div>
          </dd>
          <dt>
            <span v-text="t$('boutiqueApp.productOrder.cart')"></span>
          </dt>
          <dd>
            <div v-if="productOrder.cart">
              <router-link :to="{ name: 'ShoppingCartView', params: { shoppingCartId: productOrder.cart.id } }">{{
                productOrder.cart.id
              }}</router-link>
            </div>
          </dd>
        </dl>
        <button type="submit" v-on:click.prevent="previousState()" class="btn btn-info" data-cy="entityDetailsBackButton">
          <font-awesome-icon icon="arrow-left"></font-awesome-icon>&nbsp;<span v-text="t$('entity.action.back')"></span>
        </button>
        <router-link
          v-if="productOrder.id"
          :to="{ name: 'ProductOrderEdit', params: { productOrderId: productOrder.id } }"
          custom
          v-slot="{ navigate }"
        >
          <button @click="navigate" class="btn btn-primary">
            <font-awesome-icon icon="pencil-alt"></font-awesome-icon>&nbsp;<span v-text="t$('entity.action.edit')"></span>
          </button>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./product-order-details.component.ts"></script>
