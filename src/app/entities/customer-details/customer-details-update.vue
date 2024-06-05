<template>
  <div class="row justify-content-center">
    <div class="col-8">
      <form name="editForm" novalidate v-on:submit.prevent="save()">
        <h2
          id="boutiqueApp.customerDetails.home.createOrEditLabel"
          data-cy="CustomerDetailsCreateUpdateHeading"
          v-text="t$('boutiqueApp.customerDetails.home.createOrEditLabel')"
        ></h2>
        <div>
          <div class="form-group" v-if="customerDetails.id">
            <label for="id" v-text="t$('global.field.id')"></label>
            <input type="text" class="form-control" id="id" name="id" v-model="customerDetails.id" readonly />
          </div>
          <div class="form-group">
            <label class="form-control-label" v-text="t$('boutiqueApp.customerDetails.gender')" for="customer-details-gender"></label>
            <select
              class="form-control"
              name="gender"
              :class="{ valid: !v$.gender.$invalid, invalid: v$.gender.$invalid }"
              v-model="v$.gender.$model"
              id="customer-details-gender"
              data-cy="gender"
              required
            >
              <option v-for="gender in genderValues" :key="gender" v-bind:value="gender" v-bind:label="t$('boutiqueApp.Gender.' + gender)">
                {{ gender }}
              </option>
            </select>
            <div v-if="v$.gender.$anyDirty && v$.gender.$invalid">
              <small class="form-text text-danger" v-for="error of v$.gender.$errors" :key="error.$uid">{{ error.$message }}</small>
            </div>
          </div>
          <div class="form-group">
            <label class="form-control-label" v-text="t$('boutiqueApp.customerDetails.phone')" for="customer-details-phone"></label>
            <input
              type="text"
              class="form-control"
              name="phone"
              id="customer-details-phone"
              data-cy="phone"
              :class="{ valid: !v$.phone.$invalid, invalid: v$.phone.$invalid }"
              v-model="v$.phone.$model"
              required
            />
            <div v-if="v$.phone.$anyDirty && v$.phone.$invalid">
              <small class="form-text text-danger" v-for="error of v$.phone.$errors" :key="error.$uid">{{ error.$message }}</small>
            </div>
          </div>
          <div class="form-group">
            <label
              class="form-control-label"
              v-text="t$('boutiqueApp.customerDetails.addressLine1')"
              for="customer-details-addressLine1"
            ></label>
            <input
              type="text"
              class="form-control"
              name="addressLine1"
              id="customer-details-addressLine1"
              data-cy="addressLine1"
              :class="{ valid: !v$.addressLine1.$invalid, invalid: v$.addressLine1.$invalid }"
              v-model="v$.addressLine1.$model"
              required
            />
            <div v-if="v$.addressLine1.$anyDirty && v$.addressLine1.$invalid">
              <small class="form-text text-danger" v-for="error of v$.addressLine1.$errors" :key="error.$uid">{{ error.$message }}</small>
            </div>
          </div>
          <div class="form-group">
            <label
              class="form-control-label"
              v-text="t$('boutiqueApp.customerDetails.addressLine2')"
              for="customer-details-addressLine2"
            ></label>
            <input
              type="text"
              class="form-control"
              name="addressLine2"
              id="customer-details-addressLine2"
              data-cy="addressLine2"
              :class="{ valid: !v$.addressLine2.$invalid, invalid: v$.addressLine2.$invalid }"
              v-model="v$.addressLine2.$model"
            />
          </div>
          <div class="form-group">
            <label class="form-control-label" v-text="t$('boutiqueApp.customerDetails.city')" for="customer-details-city"></label>
            <input
              type="text"
              class="form-control"
              name="city"
              id="customer-details-city"
              data-cy="city"
              :class="{ valid: !v$.city.$invalid, invalid: v$.city.$invalid }"
              v-model="v$.city.$model"
              required
            />
            <div v-if="v$.city.$anyDirty && v$.city.$invalid">
              <small class="form-text text-danger" v-for="error of v$.city.$errors" :key="error.$uid">{{ error.$message }}</small>
            </div>
          </div>
          <div class="form-group">
            <label class="form-control-label" v-text="t$('boutiqueApp.customerDetails.country')" for="customer-details-country"></label>
            <input
              type="text"
              class="form-control"
              name="country"
              id="customer-details-country"
              data-cy="country"
              :class="{ valid: !v$.country.$invalid, invalid: v$.country.$invalid }"
              v-model="v$.country.$model"
              required
            />
            <div v-if="v$.country.$anyDirty && v$.country.$invalid">
              <small class="form-text text-danger" v-for="error of v$.country.$errors" :key="error.$uid">{{ error.$message }}</small>
            </div>
          </div>
          <div class="form-group">
            <label class="form-control-label" v-text="t$('boutiqueApp.customerDetails.user')" for="customer-details-user"></label>
            <select class="form-control" id="customer-details-user" data-cy="user" name="user" v-model="customerDetails.user" required>
              <option v-if="!customerDetails.user" v-bind:value="null" selected></option>
              <option
                v-bind:value="customerDetails.user && userOption.id === customerDetails.user.id ? customerDetails.user : userOption"
                v-for="userOption in users"
                :key="userOption.id"
              >
                {{ userOption.login }}
              </option>
            </select>
          </div>
          <div v-if="v$.user.$anyDirty && v$.user.$invalid">
            <small class="form-text text-danger" v-for="error of v$.user.$errors" :key="error.$uid">{{ error.$message }}</small>
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
<script lang="ts" src="./customer-details-update.component.ts"></script>
