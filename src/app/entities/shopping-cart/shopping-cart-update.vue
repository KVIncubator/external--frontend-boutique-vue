<template>
  <div class="row justify-content-center">
    <div class="col-8">
      <form name="editForm" novalidate v-on:submit.prevent="save()">
        <h2
          id="boutiqueApp.shoppingCart.home.createOrEditLabel"
          data-cy="ShoppingCartCreateUpdateHeading"
          v-text="t$('boutiqueApp.shoppingCart.home.createOrEditLabel')"
        ></h2>
        <div>
          <div class="form-group" v-if="shoppingCart.id">
            <label for="id" v-text="t$('global.field.id')"></label>
            <input type="text" class="form-control" id="id" name="id" v-model="shoppingCart.id" readonly />
          </div>
          <div class="form-group">
            <label class="form-control-label" v-text="t$('boutiqueApp.shoppingCart.placedDate')" for="shopping-cart-placedDate"></label>
            <div class="d-flex">
              <input
                id="shopping-cart-placedDate"
                data-cy="placedDate"
                type="datetime-local"
                class="form-control"
                name="placedDate"
                :class="{ valid: !v$.placedDate.$invalid, invalid: v$.placedDate.$invalid }"
                required
                :value="convertDateTimeFromServer(v$.placedDate.$model)"
                @change="updateInstantField('placedDate', $event)"
              />
            </div>
            <div v-if="v$.placedDate.$anyDirty && v$.placedDate.$invalid">
              <small class="form-text text-danger" v-for="error of v$.placedDate.$errors" :key="error.$uid">{{ error.$message }}</small>
            </div>
          </div>
          <div class="form-group">
            <label class="form-control-label" v-text="t$('boutiqueApp.shoppingCart.status')" for="shopping-cart-status"></label>
            <select
              class="form-control"
              name="status"
              :class="{ valid: !v$.status.$invalid, invalid: v$.status.$invalid }"
              v-model="v$.status.$model"
              id="shopping-cart-status"
              data-cy="status"
              required
            >
              <option
                v-for="orderStatus in orderStatusValues"
                :key="orderStatus"
                v-bind:value="orderStatus"
                v-bind:label="t$('boutiqueApp.OrderStatus.' + orderStatus)"
              >
                {{ orderStatus }}
              </option>
            </select>
            <div v-if="v$.status.$anyDirty && v$.status.$invalid">
              <small class="form-text text-danger" v-for="error of v$.status.$errors" :key="error.$uid">{{ error.$message }}</small>
            </div>
          </div>
          <div class="form-group">
            <label class="form-control-label" v-text="t$('boutiqueApp.shoppingCart.totalPrice')" for="shopping-cart-totalPrice"></label>
            <input
              type="number"
              class="form-control"
              name="totalPrice"
              id="shopping-cart-totalPrice"
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
            <label
              class="form-control-label"
              v-text="t$('boutiqueApp.shoppingCart.paymentMethod')"
              for="shopping-cart-paymentMethod"
            ></label>
            <select
              class="form-control"
              name="paymentMethod"
              :class="{ valid: !v$.paymentMethod.$invalid, invalid: v$.paymentMethod.$invalid }"
              v-model="v$.paymentMethod.$model"
              id="shopping-cart-paymentMethod"
              data-cy="paymentMethod"
              required
            >
              <option
                v-for="paymentMethod in paymentMethodValues"
                :key="paymentMethod"
                v-bind:value="paymentMethod"
                v-bind:label="t$('boutiqueApp.PaymentMethod.' + paymentMethod)"
              >
                {{ paymentMethod }}
              </option>
            </select>
            <div v-if="v$.paymentMethod.$anyDirty && v$.paymentMethod.$invalid">
              <small class="form-text text-danger" v-for="error of v$.paymentMethod.$errors" :key="error.$uid">{{ error.$message }}</small>
            </div>
          </div>
          <div class="form-group">
            <label
              class="form-control-label"
              v-text="t$('boutiqueApp.shoppingCart.paymentReference')"
              for="shopping-cart-paymentReference"
            ></label>
            <input
              type="text"
              class="form-control"
              name="paymentReference"
              id="shopping-cart-paymentReference"
              data-cy="paymentReference"
              :class="{ valid: !v$.paymentReference.$invalid, invalid: v$.paymentReference.$invalid }"
              v-model="v$.paymentReference.$model"
            />
          </div>
          <div class="form-group">
            <label
              class="form-control-label"
              v-text="t$('boutiqueApp.shoppingCart.customerDetails')"
              for="shopping-cart-customerDetails"
            ></label>
            <select
              class="form-control"
              id="shopping-cart-customerDetails"
              data-cy="customerDetails"
              name="customerDetails"
              v-model="shoppingCart.customerDetails"
              required
            >
              <option v-if="!shoppingCart.customerDetails" v-bind:value="null" selected></option>
              <option
                v-bind:value="
                  shoppingCart.customerDetails && customerDetailsOption.id === shoppingCart.customerDetails.id
                    ? shoppingCart.customerDetails
                    : customerDetailsOption
                "
                v-for="customerDetailsOption in customerDetails"
                :key="customerDetailsOption.id"
              >
                {{ customerDetailsOption.id }}
              </option>
            </select>
          </div>
          <div v-if="v$.customerDetails.$anyDirty && v$.customerDetails.$invalid">
            <small class="form-text text-danger" v-for="error of v$.customerDetails.$errors" :key="error.$uid">{{ error.$message }}</small>
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
<script lang="ts" src="./shopping-cart-update.component.ts"></script>
