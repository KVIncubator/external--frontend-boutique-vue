<template>
  <div class="row justify-content-center">
    <div class="col-8">
      <div v-if="customerDetails">
        <h2 class="jh-entity-heading" data-cy="customerDetailsDetailsHeading">
          <span v-text="t$('boutiqueApp.customerDetails.detail.title')"></span> {{ customerDetails.id }}
        </h2>
        <dl class="row jh-entity-details">
          <dt>
            <span v-text="t$('boutiqueApp.customerDetails.gender')"></span>
          </dt>
          <dd>
            <span v-text="t$('boutiqueApp.Gender.' + customerDetails.gender)"></span>
          </dd>
          <dt>
            <span v-text="t$('boutiqueApp.customerDetails.phone')"></span>
          </dt>
          <dd>
            <span>{{ customerDetails.phone }}</span>
          </dd>
          <dt>
            <span v-text="t$('boutiqueApp.customerDetails.addressLine1')"></span>
          </dt>
          <dd>
            <span>{{ customerDetails.addressLine1 }}</span>
          </dd>
          <dt>
            <span v-text="t$('boutiqueApp.customerDetails.addressLine2')"></span>
          </dt>
          <dd>
            <span>{{ customerDetails.addressLine2 }}</span>
          </dd>
          <dt>
            <span v-text="t$('boutiqueApp.customerDetails.city')"></span>
          </dt>
          <dd>
            <span>{{ customerDetails.city }}</span>
          </dd>
          <dt>
            <span v-text="t$('boutiqueApp.customerDetails.country')"></span>
          </dt>
          <dd>
            <span>{{ customerDetails.country }}</span>
          </dd>
          <dt>
            <span v-text="t$('boutiqueApp.customerDetails.user')"></span>
          </dt>
          <dd>
            {{ customerDetails.user ? customerDetails.user.login : '' }}
          </dd>
        </dl>
        <button type="submit" v-on:click.prevent="previousState()" class="btn btn-info" data-cy="entityDetailsBackButton">
          <font-awesome-icon icon="arrow-left"></font-awesome-icon>&nbsp;<span v-text="t$('entity.action.back')"></span>
        </button>
        <router-link
          v-if="customerDetails.id"
          :to="{ name: 'CustomerDetailsEdit', params: { customerDetailsId: customerDetails.id } }"
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

<script lang="ts" src="./customer-details-details.component.ts"></script>
