<template>
  <div>
    <b-dropdown-item to="/product">
      <font-awesome-icon icon="asterisk" />
      <span v-text="t$('global.menu.entities.product')"></span>
    </b-dropdown-item>
    <b-dropdown-item to="/product-category">
      <font-awesome-icon icon="asterisk" />
      <span v-text="t$('global.menu.entities.productCategory')"></span>
    </b-dropdown-item>
    <b-dropdown-item to="/customer-details">
      <font-awesome-icon icon="asterisk" />
      <span v-text="t$('global.menu.entities.customerDetails')"></span>
    </b-dropdown-item>
    <b-dropdown-item to="/shopping-cart">
      <font-awesome-icon icon="asterisk" />
      <span v-text="t$('global.menu.entities.shoppingCart')"></span>
    </b-dropdown-item>
    <b-dropdown-item to="/product-order">
      <font-awesome-icon icon="asterisk" />
      <span v-text="t$('global.menu.entities.productOrder')"></span>
    </b-dropdown-item>
    <!-- jhipster-needle-add-entity-to-menu - JHipster will add entities to the menu here -->
  </div>
</template>

<script lang="ts" src="./entities-menu.component.ts"></script>
