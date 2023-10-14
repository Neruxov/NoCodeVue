<template>
    <div class="container font-text">
        <Task :id=id :title=title :description=description :test-input=testInput :test-output=testOutput :solution=solution />
    </div>
</template>

<script>
import axios from 'axios'
import Task from './task.vue'

export default {
    data() {
        return {
            id: 1,
            title: "Выведи строку",
            description: "Выведите <code>введённую</code> строку.",
            testInput: "Hello, World!",
            testOutput: "Hello, World!",
            solution: null,
        };
    },

    mounted() {
        this.fetchData();
        this.setupEditor();
    },
    
    methods: {
        fetchData() {
            axios.get('https://jsonplaceholder.typicode.com/posts/1').then(response => {
                this.test = response.data.title;
            }).catch(error => {
                console.log(error);
            });
        },

        setupEditor() {

        }
    },

    components: { Task }
}
</script>