<template>
  <div class="flex h-full ">
    <div class="w-56 pt-5 h-full fixed left-0 top-0 shadow">
      <ul class="text-center">
        <li class="text-gray-500 font-light pt-5">
          <div class="bg-blue-500 w-56 text-white py-2 pl-2 flex cursor-pointer">
            <InboxIcon class="h-6"></InboxIcon>
            <p class="pl-2 font-thin">GMAIL</p>
          </div>
        </li>
        <li class="text-gray-500 font-light">
          <div class="hover:bg-blue-400 w-56 hover:text-white py-2 pl-2 flex cursor-pointer">
            <InboxIcon class="h-6"></InboxIcon>
            <p class="pl-2 font-thin">OUTLOOK</p>
          </div>
        </li>
      </ul>
    </div>
    <div class="w-5/6 shadow-inner bg-om-gray h-full w-full ml-56 overflow-x-scroll" id="boards">
      <div class="flex flex w-full h-auto bg-om-gray py-5">
        <div class="w-72 mr-5 p-3 bg-white border border-white rounded h-full shadow flex-none mx-5">
          <h3 class="font-bold text-2xl uppercase">INBOX</h3>
          <draggable
              class="w-full"
              :list="inbox"
              group="people"
              @change="saveBoardState"
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
        <div class="w-72 mr-5 p-3 bg-white border border-white rounded h-full shadow flex-none"
             v-for="(board, index) in boards"
             :key="index">
          <TrashIcon class="h-5 float-right text-blue-500 pt-1 cursor-pointer" @click="deleteBoard(index)"></TrashIcon>
          <h3 class="font-bold text-2xl uppercase">{{ board.name }}</h3>
          <div class="pt-2 text-sm text-gray-500" v-if="board.list.length === 0">
            <p>Keine E-Mails vorhanden</p>
          </div>
          <draggable
              class="w-full"
              :class="{'h-20' : board.list?.length === 0}"
              :list="board.list"
              group="people"
              @change="moveTicket"
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
import {InboxIcon, PlusIcon, TrashIcon} from '@heroicons/vue/solid';
import {ref, onMounted} from 'vue';
import vClickOutside from 'click-outside-vue3';
// eslint-disable-next-line no-unused-vars
import db from '@/database/nedb';
import { ElMessageBox } from 'element-plus';
import { ElLoading } from 'element-plus';

export default {
  name: 'Client',
  components: {draggable, InboxIcon, PlusIcon, TrashIcon},
  directives: {
    clickOutside: vClickOutside.directive,
  },
  setup() {

    const inbox = ref([{name: 'inbox', list: [], index: 0}]);
    const boards = ref([]);

    onMounted(() => {
      // eslint-disable-next-line no-unused-vars
      let loading = ElLoading.service({ fullscreen: false, target: '#boards' });
      db.boards.find({}).sort({index: 1}).exec(function(err, dbBoards) {
        if (dbBoards.length > 0) {
          boards.value = dbBoards;
        }
        loading.close()
      });
    });

    const newBoardName = ref('');
    const newBoardFormActivated = ref(false);

    // eslint-disable-next-line no-unused-vars
    const deleteBoard = (index) => {
      ElMessageBox.confirm('Möchtest du dieses Board löschen?', 'Bist du dir sicher?', {
        confirmButtonText: 'Löschen',
        confirmButtonClass: 'bg-red-600',
        cancelButtonText: 'Abbrechen',
        type: 'error',
        callback: action => {
          if (action === 'confirm') {
            boards.value.splice(index, 1);
            saveBoardState();
          }
        }
      });
    };

    const addBoard = () => {
      if (newBoardName.value != '') {
        const board = {name: newBoardName.value, list: [], index: boards.value.length};
        boards.value.push(board);
        newBoardName.value = '';
        deactivateNewBoardForm();
        db.boards.insert(board);
      }
    };

    const saveBoardState = () => {
      db.boards.remove({}, {multi: true});
      db.boards.insert(boards.value);
    };

    const activateNewBoardForm = () => {
      newBoardFormActivated.value = true;
    };

    const deactivateNewBoardForm = () => {
      newBoardFormActivated.value = false;
    };

    return {
      _,
      boards,
      addBoard,
      newBoardName,
      newBoardFormActivated,
      deactivateNewBoardForm,
      activateNewBoardForm,
      saveBoardState,
      inbox,
      deleteBoard,
    };
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
