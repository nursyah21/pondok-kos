<template>
    <UBreadcrumb  divider="/" :links="test" />
</template>
<script setup>
const currentLink = useRoute().path.split('/')
var links = currentLink.length < 3 ? [{ label: 'Dashboard', to: '/dashboard' }] :
    [{ label: 'Dashboard', to: '/dashboard' }, { label: currentLink[currentLink.length - 1], to: useRoute().path }]

const upperCase =(word) => word.charAt(0).toUpperCase() + word.slice(1)

const test = []
let j = ""
let to = ""
currentLink.forEach(i=>{
    if(i){
        j += i
        to += `/${i}`
        test.push({
            label: upperCase(i), to: to
        })
    }
})

</script>