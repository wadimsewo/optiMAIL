<template>
  <div class="flex h-full ">
    <div class="w-56 pt-5 h-full fixed left-0 top-0 shadow">
      <ul class="text-center">
        <li class="text-gray-500 font-light pt-5">
          <div class="bg-blue-500 w-56 text-white py-2 pl-2 flex cursor-pointer">
            <InboxIcon class="h-6"></InboxIcon>
            <p class="pl-2">INBOX</p>
          </div>
        </li>
        <li class="text-gray-500 font-light">
          <div class="hover:bg-blue-400 w-56 hover:text-white py-2 pl-2 flex cursor-pointer">
            <InboxIcon class="h-6"></InboxIcon>
            <p class="pl-2">SENT</p>
          </div>
        </li>
      </ul>
    </div>
    <div class="w-5/6 shadow-inner bg-om-gray h-full w-full ml-56 overflow-x-scroll">
      <div class="flex flex w-full h-auto bg-om-gray py-5">
        <div class="w-72 mr-5 p-3 bg-white border border-white rounded h-full shadow flex-none" :class="{'mx-5': index === 0}"
             v-for="(board, index) in boards"
             :key="board">
          <h3 class="font-bold text-2xl text-blue-500 uppercase">{{ board.name }}</h3>
          <div class="pt-2 text-sm text-gray-500" v-if="board.list.length === 0">
            <p>Keine E-Mails vorhanden</p>
          </div>
          <draggable
              class="w-full"
              :class="{'h-20' : board.list.length === 0}"
              :list="board.list"
              group="people"
              @change="log"
              itemKey="name"
          >
            <template #item="{ element }" class="h-96">
              <div class="px-2 my-5 shadow bg-om-gray">
                <div class="pt-2 font-bold">{{ element.name }}</div>
                <div class="py-5 text-sm"></div>
              </div>
            </template>
          </draggable>
        </div>

        <div class="w-60 p-3 bg-white border border-white rounded h-full shadow flex-none">
          <div v-if="newBoardFormActivated" v-click-outside="deactivateNewBoardForm">
            <el-input v-model="newBoardName" size="small" placeholder="Boardtitel eingeben..."
                      @keyup.enter="addBoard"></el-input>
            <el-button size="small" class="mt-1 bg-blue-500 text-white rounded" @click="addBoard">Board hinzufügen
            </el-button>
          </div>
          <h3 class="font-bold text-blue-500 flex cursor-pointer" v-else @click="activateNewBoardForm">
            <PlusIcon class="h-6"></PlusIcon>
            Board hinzufügen
          </h3>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import draggable from 'vuedraggable';
import _ from 'lodash';
import {InboxIcon, PlusIcon} from '@heroicons/vue/solid';
import {ref, onMounted} from 'vue';
import vClickOutside from 'click-outside-vue3';
// eslint-disable-next-line no-unused-vars
import db from '@/database/nedb';

export default {
  name: 'Client',
  components: {draggable, InboxIcon, PlusIcon},
  directives: {
    clickOutside: vClickOutside.directive,
  },
  setup() {

    const boards = ref([{name: 'inbox', list: [], index: 0}]);

    onMounted(() => {
      db.boards.find({}).sort({index: 1}).exec(function(err, dbBoards) {
        if (dbBoards.length > 0) {
          boards.value = dbBoards;
        } else {
          db.boards.insert(boards.value);
        }
      });
    });

    const newBoardName = ref('');
    const newBoardFormActivated = ref(false);
    const addBoard = () => {
      if (newBoardName.value != '') {
        const board = {name: newBoardName.value, list: [], index: boards.value.length};
        boards.value.push(board);
        newBoardName.value = '';
        deactivateNewBoardForm();
        db.boards.insert(board);
      }
    };

    const log = () => {
      db.boards.remove({ }, {multi: true})
      db.boards.insert(boards.value);
    }

    const activateNewBoardForm = () => {
      newBoardFormActivated.value = true;
    };

    const deactivateNewBoardForm = () => {
      newBoardFormActivated.value = false;
    };

    return {_, boards, addBoard, newBoardName, newBoardFormActivated, deactivateNewBoardForm, activateNewBoardForm, log};
  },
  methods: {
    add: function() {
      this.list.push({name: 'Juan'});
    },
    replace: function() {
      this.list = [{name: 'Edgard'}];
    },
    clone: function(el) {
      return {
        name: el.name + ' cloned',
      };
    },
  },
};
</script>

<style scoped>

</style>
