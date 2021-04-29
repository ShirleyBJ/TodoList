/**
* !JS Table of content
* * 1.0 - Déclaration des élèments utile aux fonctionnement l'application
* * 2.0 - Ecouteurs sur événements globaux
* * 3.0 - Déclaration des fonctions et élèments du localstorage pour la création de tâche
    * * 3.1 - function init();
    * * 3.2 - localStorage : getItem;
    * * 3.3 - fonction ajout d'une tâche dans localStorage et appel création de la fonction création de tâche
    * * 3.4 - function date et heure : time()
    * * 3.5 - function création de tâche : addItemTodo(); 
* * 4.0 - Déclaration des fonctions utile au localstorage
    * * 4.1 - Fonction récupération des taches du localStorage pour affichage : returnToDoList();
    * * 4.2 - Fonction mise à jour du local storage : dataObjectUpdated() => setItem;
* * 5.0 - Déclaration des fonctions suppression de tâche et tâche complétée
    * * 5.1 - Fonction suppression une seule tâche : deleteTask()
    * * 5.2 - Fonction suppression de toute les tâches: deleteAllTask()
    * * 5.3 - Fonction marquer la tâche comme "completed" : completedTask()
* * 6.0 - Déclaration des fonctions pour le choix des couleurs de tâche 
    * * 6.1 - Fonction choix de couleur par défault : chooseColorDefault()
    * * 6.2 - Fonction choix de couleur verte : chooseColorLightGreen()
    * * 6.3 - Fonction choix de couleur violet : chooseColorPlum()
    * * 6.4 - Fonction choix de couleur bleu : chooseColorLightBlue()
    * * 6.5 - Fonction choix de couleur rose : chooseColorPink()
* * 7.0 - Déclaration fontion de l'appel Ajax
*/

//* 1.0 - Déclaration des élèments utile aux fonctionnement l'application*/
var add = document.getElementById('add');
var body = document.querySelector('body');
var nptTitle = document.querySelector('#nptTitle');
var nptDescribe = document.querySelector('#nptDescribe');
var counterTask = document.getElementById('counterTask');
var inputField = document.querySelector('.nptField');
var msgEmpty = document.getElementById("msg-Empty");
//Déclaration Bouton choix couleur
var defaultColor = document.querySelector('.btn-default');
var pinkColor = document.querySelector('.btn-pink');
var greenColor = document.querySelector('.btn-green');
var purpleColor = document.querySelector('.btn-purple');
var blueColor = document.querySelector('.btn-blue');

var counter = 0 ;
var count = 0;
var isCompleted = false;
var backgdColor;


//**2.0 - Ecouteurs sur événements global*/
window.addEventListener('load',init);
counterTask.addEventListener('dblclick',deleteAllTask);
pinkColor.addEventListener('click',chooseColorPink);
greenColor.addEventListener('click',chooseColorLightGreen);
purpleColor.addEventListener('click',chooseColorPlum);
blueColor.addEventListener('click',chooseColorLightBlue);
defaultColor.addEventListener('click',chooseColorDefault);


//* 3.0 - Déclaration des fonctions*/
    //*3.1 - function init();*/
        function init(){
            //Fonction focus sur champ titre au chargement de la page
            nptTitle.focus();
            //Fonction récupération des tâche du localStorage au chargement de la page
            returnToDoList();
        }

    //*3.2 - LocalStorage : getItem */
    //Vérification si localStorage vide, si non récupére element autrement créer tableau task
    var data = (localStorage.getItem('todoList')) ? JSON.parse(localStorage.getItem('todoList')):{
        task:[],
    };

    //*3.3 - Fonction ajout d'une tâche dans localStorage et appel création de la fonction création de tâche
    //L'utilisateur clique sur le bouton ajouter
    add.addEventListener('click',function (){
        var titleValue = document.getElementById('nptTitle').value;
        var describeValue = document.getElementById('nptDescribe').value;
        var dateTime = time();
        isCompleted = false;
        backgdColor = backgdColor;
            //Fonction ajout de la tâche
            //Structure de contrôle pour 2 entrées obligatoire (titre et description)
            if(nptTitle.value === "" || nptDescribe.value === ""){
                alert("Veuillez entrer un titre ET une description pour ajouter une tâche. ");
            } else if (titleValue && describeValue){
                //Mise des valeurs dans un tableau temporaire pour un push dans tableau task du localstorage
                var tabTemp = [titleValue,describeValue,dateTime,isCompleted,backgdColor];
                //Structure de contrôle sur valeurs en doublon
                for (var l = 0; l<data.task.length; l++){
                    //Vérifie que les entrées ne sont pas déja stockées dans le local storage
                    if(titleValue == data.task[l][0] && describeValue == data.task[l][1]){
                        alert("Vérifiez votre entrée, tâche en doublons");
                        return;
                    }
                }
                data.task.push(tabTemp);

                //Fonction création de la tâche ci-dessous
                addItemTodo(titleValue,describeValue,dateTime,isCompleted,backgdColor);
            }
        //Remise des inputs à vide
        document.getElementById('nptTitle').value = "";
        document.getElementById('nptDescribe').value= "";
        //Remise à vide de la variable qui permet le stockage des couleurs dans le localStorage
        backgdColor = "";
        //Remise de la couleur de base du background
        inputField.style.backgroundColor = "white";
    })

    //* 3.4 - function date et heure */
        //Fonction qui "crée" la date et l'heure de la tâche crée
        function time(){
            var today = new Date();
            var date = today.getDate()+'-'+(today.getMonth()+1)+'-'+today.getFullYear();
            var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
            var dateTime = date+' '+time;
            return dateTime;
        }

    //**3.5 - function création de tâche : addItemTodo(); */

    function addItemTodo(itemT,itemD,itemDate,isDone,backgdColor){
        var list = document.getElementById('todoList');

        //Création d'une nouvelle tâche (ul)
            var title = document.createElement('ul');
            title.setAttribute("name",count);
            title.innerText = itemT;

        //Création de la description (li)
            var description = document.createElement('li');
            description.innerText = itemD;

        //CRéation d'un élement p pour ajout de l'heure à la tâche
            var dateAndTime = document.createElement('p');
            dateAndTime.innerText = itemDate;
            dateAndTime.classList.add("date-time");

        //Création des bouttons supprimer et completer
            var blockButtons = document.createElement('div');
            blockButtons.classList.add('block__btn-list');

            var deleteBtn = document.createElement('button');
            deleteBtn.className = "fas fa-trash";
            deleteBtn.setAttribute("name",count);
            deleteBtn.classList.add("btn-list");

        //Ajout écouteurs sur event click sur icone poubelle 
            deleteBtn.addEventListener('click',deleteTask);

            var doneBtn = document.createElement('button');
            doneBtn.setAttribute("name",count);
            doneBtn.className = "fas fa-check-square";
            doneBtn.classList.add("btn-list");

        //Ajout écouteurs sur event click sur icone tâche achevées
            doneBtn.addEventListener('click',completedTask);

        //Vérifie si la tâche est déja marqué comme complété lors de la récupération du localstorage, puis affecte la classe complété si besoin.
            if(isDone == true){
                counter--;
                title.classList.toggle("completed");
            }

        //Vérification de la couleur enregistré dans le local storage pour réaffichage.
            if(backgdColor == "palevioletred"){
                title.classList.add("btn-pink");
            } else if(backgdColor == "darkslategrey"){
                title.classList.add("btn-green");
            } else if(backgdColor == "royalblue"){
                title.classList.add("btn-blue");
            } else if(backgdColor == "slateblue"){
                title.classList.add("btn-purple");
            }else if(backgdColor == "goldenrod"){
                title.classList.add("btn-default");
            }

        //Imbrication des éléments crées dans le DOM
            blockButtons.appendChild(deleteBtn);
            blockButtons.appendChild(doneBtn);
            blockButtons.appendChild(dateAndTime);
            blockButtons.insertBefore(dateAndTime,blockButtons.childNodes[0]);
            title.appendChild(description);
            title.appendChild(blockButtons);
            list.appendChild(title);

        //Ajout les tâches par le haut de la liste (plus anciennes tâches seront en bas)
            list.insertBefore(title,list.childNodes[0]);

        //Coumpteur du nombres de tâche
            counter++;
            document.getElementById('counterTask').innerHTML = counter;

        //Structure conditionelle qui applique le choix couleur de la zone de saisie à la tâche lors de la création
            if(inputField.style.backgroundColor == "palevioletred"){//pink
                title.classList.add('btn-pink');
            } else if(inputField.style.backgroundColor == "darkslategrey"){//green
                title.classList.add('btn-green');
            }else if(inputField.style.backgroundColor == "royalblue"){
                title.classList.add('btn-blue');
            }else if(inputField.style.backgroundColor == "slateblue"){//purple
                title.classList.add('btn-purple');
            }else if(inputField.style.backgroundColor == "goldenrod"){//yellow
                title.classList.add('btn-default');
            }
            
            //Incrementation sur l'attribut name pour sélectionner cette tâche en particulier dans la fonction supprimer et completé
            count++;
            dataObjectUpdated();
    }


//* 4.0 - Déclaration des fonctions utile au localstorage*/
    //* 4.1 - Fonction récupération des tâches du localStorage pour affichage : returnToDoList()*/
    //Réutilisation de la fonction addItemTodo() pour ré-afficher une tâche
        function returnToDoList(){
        //Si vide ne retourne rien 
            if(!data.task.length) return;
            //console.log(data.task);
            for (var i = 0; i<data.task.length; i++){
                //console.log(data.task[i]);
                var titre = data.task[i][0];
                var description = data.task[i][1];
                var date = data.task[i][2];
                var done = data.task[i][3];
                var backgdColor= data.task[i][4];
                addItemTodo(titre,description,date,done,backgdColor);
            }
        }

    //* 4.2 Fonction mise à jour du local storage : dataObjectUpdated() */
    /*Chaque modification de tâches est enregistré dans le localstrorage par appel de cette fonction 
    dans les fonctions créer, supprimer une tâche, supprimer toutes les tâches*/
        function dataObjectUpdated(){
            localStorage.setItem('todoList',JSON.stringify(data));
            if(counter > 0){
                msgEmpty.innerHTML = "";
            } else{
                msgEmpty.innerHTML = "Aucune tâche en cours";
            }
        }
        
//* 5.0 - Déclaration des fonctions suppression de tâche*/
    //* 5.1 - Fonction suppression d'une seule tâche */
        function deleteTask(){
            var item = this.parentNode.parentNode;
            var parent = item.parentNode;
            var numTask = this.name;

            data.task.splice(numTask,1);
            parent.removeChild(item);

            if(item.classList.contains("completed")){
                counter = counter;
                document.getElementById('counterTask').innerHTML = counter;
            } else {
                counter--;
                document.getElementById('counterTask').innerHTML = counter;
            }
            dataObjectUpdated();
        }  

    //* 5.2 - Fonction suppression de toutes les tâches */
        function deleteAllTask(){
            var task = document.getElementById('todoList');

            //Vide le localStorage
            data.task.splice(0,data.task.length);

            //Enleve tout les elements de la todolist
            while(task.firstChild){
                    task.removeChild(task.firstChild);
            }
            //Compteur de tâ^che remis à zéro
            counter = 0;
            document.getElementById('counterTask').innerHTML = counter;
            dataObjectUpdated();
        }

    //* 5.3 - Fonction marquer la tâche comme "completed" :  */
        function completedTask(){
                isCompleted = true;
                var task = this.parentNode.parentNode;
                var numTask = this.name;
                task.classList.toggle("completed");

                if(task.classList.contains("completed")){
                    counter--;
                    document.getElementById('counterTask').innerHTML = counter;
                } else {
                    counter++;
                    document.getElementById('counterTask').innerHTML = counter;
                }

            //Enregistrer dans le localstorage une tâche faite pour la réafficher au rafraichissement de la page
                if(data.task[numTask][3] == false){
                    data.task[numTask][3] = true;
                    //console.log(data.task[i][3]);
                } else if(data.task[numTask][3]==true){
                    data.task[numTask][3] = false;
                }
            dataObjectUpdated();
        }
    

//*6.0 - Déclaration des fonctions pour le choix des couleurs de tâche
    //Fonctions choix de couleur de la tâche qui renvoie une valeur dans le localstorage
    //*6.1 - Fonction choix de couleur par défault
    function chooseColorDefault(){
        if(inputField.style.backgroundColor != "goldenrod"){
        inputField.style.backgroundColor = "goldenrod";
        backgdColor = "goldenrod";
            return backgdColor;
        } 
    }

    //*6.2 - Fonction choix de couleur vert
    function chooseColorLightGreen(){
        if (inputField.style.backgroundColor != "darkslategrey") {
            inputField.style.backgroundColor = "darkslategrey";
            backgdColor = "darkslategrey";
            return backgdColor;
        }
    }

    //*6.3 - Fonction choix de couleur violet
    function chooseColorPlum(){
        if (inputField.style.backgroundColor != "slateblue") {
            inputField.style.backgroundColor = "slateblue";
            backgdColor = "slateblue";
            return backgdColor;
        }
    }

    //*6.4 - Fonction choix de couleur bleu
    function chooseColorLightBlue(){
        if (inputField.style.backgroundColor != "royalblue") {
            inputField.style.backgroundColor = "royalblue";
            backgdColor = "royalblue";
            return backgdColor;
        }
    }

    //*6.5 - Fonction choix de couleur rose
    function chooseColorPink(){
            if(inputField.style.backgroundColor != "palevioletred"){
            inputField.style.backgroundColor = "palevioletred";
            backgdColor = "palevioletred";
            return backgdColor;
            } 
        }

//** 7.0 - Déclaration fontion de l'appel Ajax */
    /*APPEL AJAX DES IMAGES CLIQUABLE EN FOND DE LA LISTE*/ 
    var countAjax;
    for(var i = 0; i<5 ;i++){
        function imgCall(){
            var url = "https://picsum.photos/1250/800";
            var xhr = new XMLHttpRequest();

            xhr.open('GET',url,true);
            xhr.send(null);
            xhr.onreadystatechange = function (){
                if(xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 0)){
                    var rep = xhr.responseURL;
                    //console.log(rep);
                    let img = document.createElement('img');
                    img.src = rep;
                    document.getElementsByTagName('aside')[0].appendChild(img);
                    countAjax++;
                    img.className = "img-style";
                //Event click on img
                    img.addEventListener('click',function (){
                        console.log("Clique image fonctionne ! ");
                    var bckgd = document.getElementById('background-Ajax');
                        bckgd.style.backgroundImage = "url("+rep+")"
                        bckgd.style.backgroundRepeat = "no-repeat";
                        bckgd.style.backgroundSize = "cover";
                        bckgd.style.backgroundPosition = "center";
                    })
                    //Mettre une image en background de la todolist
                    var bckgd = document.getElementById('background-Ajax');
                        bckgd.style.backgroundImage = "url("+rep+")";
                        bckgd.style.backgroundRepeat = "no-repeat";
                        bckgd.style.backgroundSize = "cover";
                        bckgd.style.backgroundPosition = "center";
                }
            }
        }
        imgCall();
    }