# vue-rest-hooks

typescript @vue/composition-api restfull-api-hooks fetch

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

//if you want to use the fetchMore, your request Promise resolved data must be an Array type
fetchMore({
  variables:{...}
})
```

this loading,error,and data is reactive, also you can use the refetch to refresh data and fetch the new, the variables arg
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

when you use delete function like this:

```
delete({
  variables:{...} ,
  update(result){
    // doSomething
  }
})

// => delete(variables)
```

and the data loading error is also reactive
