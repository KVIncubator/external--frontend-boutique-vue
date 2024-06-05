<template>
  <div class="row justify-content-center">
    <div class="col-8">
      <form name="editForm" novalidate v-on:submit.prevent="save()">
        <h2
          id="boutiqueApp.productOrder.home.createOrEditLabel"
          data-cy="ProductOrderCreateUpdateHeading"
          v-text="t$('boutiqueApp.productOrder.home.createOrEditLabel')"
        ></h2>
        <div>
          <div class="form-group" v-if="productOrder.id">
            <label for="id" v-text="t$('global.field.id')"></label>
            <input type="text" class="form-control" id="id" name="id" v-model="productOrder.id" readonly />
          </div>
          <div class="form-group">
            <label class="form-control-label" v-text="t$('boutiqueApp.productOrder.quantity')" for="product-order-quantity"></label>
            <input
              type="number"
              class="form-control"
              name="quantity"
              id="product-order-quantity"
              data-cy="quantity"
              :class="{ valid: !v$.quantity.$invalid, invalid: v$.quantity.$invalid }"
              v-model.number="v$.quantity.$model"
              required
            />
            <div v-if="v$.quantity.$anyDirty && v$.quantity.$invalid">
              <small class="form-text text-danger" v-for="error of v$.quantity.$errors" :key="error.$uid">{{ error.$message }}</small>
            </div>
          </div>
          <div class="form-group">
            <label class="form-control-label" v-text="t$('boutiqueApp.productOrder.totalPrice')" for="product-order-totalPrice"></label>
            <input
              type="number"
              class="form-control"
              name="totalPrice"
              id="product-order-totalPrice"
              data-cy="totalPrice"
              :class="{ valid: !v$.totalPrice.$invalid, invalid: v$.totalPrice.$invalid }"
              v-model.number="v$.totalPrice.$model"
              required
            />
            <div v-if="v$.totalPrice.$anyDirty && v$.totalPrice.$invalid">
              <small class="form-text text-danger" v-for="error of v$.totalPrice.$errors" :key="error.$uid">{{ error.$message }}</small>
            </div>
          </div>
          <div class="form-group">
            <label class="form-control-label" v-text="t$('boutiqueApp.productOrder.product')" for="product-order-product"></label>
            <select
              class="form-control"
              id="product-order-product"
              data-cy="product"
              name="product"
              v-model="productOrder.product"
              required
            >
              <option v-if="!productOrder.product" v-bind:value="null" selected></option>
              <option
                v-bind:value="productOrder.product && productOption.id === productOrder.product.id ? productOrder.product : productOption"
                v-for="productOption in products"
                :key="productOption.id"
              >
                {{ productOption.name }}
              </option>
            </select>
          </div>
          <div v-if="v$.product.$anyDirty && v$.product.$invalid">
            <small class="form-text text-danger" v-for="error of v$.product.$errors" :key="error.$uid">{{ error.$message }}</small>
          </div>
          <div class="form-group">
            <label class="form-control-label" v-text="t$('boutiqueApp.productOrder.cart')" for="product-order-cart"></label>
            <select class="form-control" id="product-order-cart" data-cy="cart" name="cart" v-model="productOrder.cart" required>
              <option v-if="!productOrder.cart" v-bind:value="null" selected></option>
              <option
                v-bind:value="productOrder.cart && shoppingCartOption.id === productOrder.cart.id ? productOrder.cart : shoppingCartOption"
                v-for="shoppingCartOption in shoppingCarts"
                :key="shoppingCartOption.id"
              >
                {{ shoppingCartOption.id }}
              </option>
            </select>
          </div>
          <div v-if="v$.cart.$anyDirty && v$.cart.$invalid">
            <small class="form-text text-danger" v-for="error of v$.cart.$errors" :key="error.$uid">{{ error.$message }}</small>
          </div>
        </div>
        <div>
          <button type="button" id="cancel-save" data-cy="entityCreateCancelButton" class="btn btn-secondary" v-on:click="previousState()">
            <font-awesome-icon icon="ban"></font-awesome-icon>&nbsp;<span v-text="t$('entity.action.cancel')"></span>
          </button>
          <button
            type="submit"
            id="save-entity"
            data-cy="entityCreateSaveButton"
            :disabled="v$.$invalid || isSaving"
            class="btn btn-primary"
          >
            <font-awesome-icon icon="save"></font-awesome-icon>&nbsp;<span v-text="t$('entity.action.save')"></span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
<script lang="ts" src="./product-order-update.component.ts"></script>
