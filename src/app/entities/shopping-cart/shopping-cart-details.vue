<template>
  <div class="row justify-content-center">
    <div class="col-8">
      <div v-if="shoppingCart">
        <h2 class="jh-entity-heading" data-cy="shoppingCartDetailsHeading">
          <span v-text="t$('boutiqueApp.shoppingCart.detail.title')"></span> {{ shoppingCart.id }}
        </h2>
        <dl class="row jh-entity-details">
          <dt>
            <span v-text="t$('boutiqueApp.shoppingCart.placedDate')"></span>
          </dt>
          <dd>
            <span v-if="shoppingCart.placedDate">{{ formatDateLong(shoppingCart.placedDate) }}</span>
          </dd>
          <dt>
            <span v-text="t$('boutiqueApp.shoppingCart.status')"></span>
          </dt>
          <dd>
            <span v-text="t$('boutiqueApp.OrderStatus.' + shoppingCart.status)"></span>
          </dd>
          <dt>
            <span v-text="t$('boutiqueApp.shoppingCart.totalPrice')"></span>
          </dt>
          <dd>
            <span>{{ shoppingCart.totalPrice }}</span>
          </dd>
          <dt>
            <span v-text="t$('boutiqueApp.shoppingCart.paymentMethod')"></span>
          </dt>
          <dd>
            <span v-text="t$('boutiqueApp.PaymentMethod.' + shoppingCart.paymentMethod)"></span>
          </dd>
          <dt>
            <span v-text="t$('boutiqueApp.shoppingCart.paymentReference')"></span>
          </dt>
          <dd>
            <span>{{ shoppingCart.paymentReference }}</span>
          </dd>
          <dt>
            <span v-text="t$('boutiqueApp.shoppingCart.customerDetails')"></span>
          </dt>
          <dd>
            <div v-if="shoppingCart.customerDetails">
              <router-link :to="{ name: 'CustomerDetailsView', params: { customerDetailsId: shoppingCart.customerDetails.id } }">{{
                shoppingCart.customerDetails.id
              }}</router-link>
            </div>
          </dd>
        </dl>
        <button type="submit" v-on:click.prevent="previousState()" class="btn btn-info" data-cy="entityDetailsBackButton">
          <font-awesome-icon icon="arrow-left"></font-awesome-icon>&nbsp;<span v-text="t$('entity.action.back')"></span>
        </button>
        <router-link
          v-if="shoppingCart.id"
          :to="{ name: 'ShoppingCartEdit', params: { shoppingCartId: shoppingCart.id } }"
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

<script lang="ts" src="./shopping-cart-details.component.ts"></script>
