<template>
    <div class="absolute w-full h-full bg-neutral-900">
        <div class="overflow-auto flex flex-col justify-between h-full">
            <div class="flex flex-col items-center  ">
                <h1 class="text-8xl p-10 font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-blue-500 background-animate">NoCode</h1>
                
                <div class="mb-5 bg-neutral-925 p-4 rounded-xl overflow-hidden w-[90%] md:w-[70%] flex flex-col gap-1.5">
                    <div class="flex gap-1.5">
                        <button class="bg-neutral-900 p-2 mb-1 rounded-xl w-[28.4%] font-bold"
                                v-for="i in [1, 2, 3]"></button>
                        
                        <button class="bg-green-800 p-2 mb-1 rounded-xl font-bold text-lg"
                                @click="selectRandom()">Случайная задача</button>
                    </div>
                    
                    <div class="text-2xl flex justify-between cursor-pointer"
                        v-for="task in tasks">
                        <a class="font-normal" :href="/task/ + task.id"><strong>{{ task.id }}.</strong> {{ task.title }}</a>
                        
                        <div v-if="task.tags.length > 0" class="flex gap-1.5">
                            <span v-for="tag in task.tags" 
                                class="rounded-2xl pl-2 pr-2 pt-1.5 pb-1 text-sm"
                                :class="tagStyles[tag]">{{ tagNames[tag] }}</span>
                        </div>
                    </div>
                </div>
            </div>

            <Footer class="mb-5 mt-5"></Footer>
        </div>
    </div>
</template>

<style scoped>
  .background-animate {
    background-size: 400%;

    -webkit-animation: gradient 3s ease infinite;
    -moz-animation: gradient 3s ease infinite;
    animation: gradient 3s ease infinite;
  }

  @keyframes gradient {
    0%,
    100% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
  }
</style>

<style>
    a {
        font-weight: bold;
    }
</style>

<script setup>
import { onMounted, ref } from 'vue'
import { tagNames, tagStyles } from '../constants'
import Footer from './footer.vue'

const tasks = ref([])

const loadTasks = async () => {
    fetch('https://judger.neruxov.xyz/api/v1/tasks/get-all')
        .then(response => response.json())
        .then(data => {
            tasks.value = data
        }).catch(err => {
            console.log(err)
        })
}

const redirectToTask = (id) => {
    window.location.href = '/task/' + id
}

const selectRandom = () => {
    const randomTask = tasks.value[Math.floor(Math.random() * tasks.value.length)]
    redirectToTask(randomTask.id)
}

onMounted(() => {
    loadTasks()
})

</script>
