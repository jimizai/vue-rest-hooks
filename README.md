# vue-rest-hooks

typescript @vue/composition-api restfull-api-hooks fetch

### Qucik Start

```
npm i vue-rest-hooks -S

import { WrappedSetupPlugin } from "vue-rest-hooks";
Vue.use(WrappedSetupPlugin)

setup(_, ctx){
  // vuex functions are used like before
  // the one different is getters and states args are Ref
  const state = ctx.vuex.mapState
  const getters = ctx.vuex.mapGetters
  const actions = ctx.vuex.mapActions
  const mutations = ctx.vuex.mapMutations

  // ctx.route
  ctx.route:Route {
    path: string
    name?: string
    hash: string
    query: Dictionary<string | (string | null)[]>
    params: Dictionary<string>
    fullPath: string
    matched: RouteRecord[]
    redirectedFrom?: string
    meta?: any
  }
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
})

refecth({
  variables:{...}
})

//If you want to use the fetchMore, your request Promise resolved data must be an Array type
fetchMore({
  variables:{...}
})
```

The loading,error, data args are reactive, also you can use the refetch to refresh data and fetch the new, the variables arg
is the query params => fetchData(variables)

### useMutation

```
const [delete:fn, {loading, error, data }] = useMutation(deleteOne:fn, {
  variables:{...},
  update(result) {
    // doSomething
  }
})
```

When you use delete function like this:

```
delete({
  variables:{...} ,
  update(result){
    // doSomething
  }
})

// => delete(variables)
```

And the data loading error args are also reactive
