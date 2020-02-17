# vue-rest-hooks

typescript @vue/composition-api restfull-api-hooks fetch

### Qucik Start

```
npm i vue-rest-hooks -S

import { WrappedSetupPlugin } from "vue-rest-hooks";
Vue.use(WrappedSetupPlugin)

setup(_, ctx){
  // vuex functions
  // the getters and states args are Refs
  const state = ctx.vuex.mapState
  const getters = ctx.vuex.mapGetters
  const actions = ctx.vuex.mapActions
  const mutations = ctx.vuex.mapMutations

  // ctx.route
  ctx.route = this.$route

  //ctx.router
  ctx.router = this.$router

  //ctx.store
  ctx.store = Vuex.Store
}

```

### useQuery

```
const {
  loading,
  error,
  data,
  refetch,
  fetchMore
} = useQuery(fetchData:fn,{
  variables:{...}
},{lazy: false})

when the options lazy is true, useQuery will not do the request at first time

refecth({
  variables:{...},
  update(result){
    // do some things
  }
})

//If you want to use the fetchMore, your request Promise resolved data must be an Array type
fetchMore({
  variables:{...},
  update(result) {
    // do some things
  }
})
```

The loading,error, data args are reactive, also you can use the refetch to refresh data and fetch the new, the variables arg
is the query params => fetchData(variables)

### useMutation

```
const [delete:fn, {loading, error, data }] = useMutation(deleteOne:fn, {
  variables:{...},
  update(result) {
    // do some things
  }
})
```

When you use delete function like this:

```
delete({
  variables:{...} ,
  update(result){
    // do some things
  }
})

// => delete(variables)
```

And the data loading error args are also reactive
