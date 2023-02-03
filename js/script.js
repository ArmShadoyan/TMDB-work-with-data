
const root = document.getElementById("root");

const parametrs = {
	path:"https://api.themoviedb.org/3/movie",
	api_key:"ef95e7811c7ac3fdefad4ff366807024",
	filter:"popular"
};

let pageNum = 1;
function getDb(filter = parametrs.filter,path,api_key,pageNum){
	const url = `${path}/${filter}?api_key=${api_key}&language=en-US&page=${pageNum}&region=am`;

	return fetch(url).then(data => data.json());
}

getDb(parametrs.filter,parametrs.path,parametrs.api_key,pageNum)
.then(data =>{
		 console.log(data);
		 return data;})
.then(data =>{
	createSearchblock(data,pageNum);
});


function createSearchblock(data,pageNum){
	const html = `
	<div class="inputBlock">
		<form>
			<input type="text" class="searchInput">
			<button>search</button>
		</form> 
		<h3 class="pagesTitle">PAGES</h3>
		<div class="pages">
			<button class="leftBtn">previous</button>
			<h3 class="pageNum">${pageNum}</h3>
			<button class="rightBtn">next</button>
		</div>
	</div>
	<div class="listsBlock"></div>
	`;
	root.innerHTML = html;

		createListItem(data);
		createInfoBlock(data);
		pages(pageNum,data);
		search(data);
		
	}


function search(data){
	const inputBlock = document.querySelector(".inputBlock");
		inputBlock.addEventListener("submit",(e)=>{
			e.preventDefault();
			const searchedItems = [];
			const value = document.querySelector(".searchInput").value;
			const listsBlock = document.querySelector(".listsBlock");
			data.results.forEach(item => {
				if(item.title.toUpperCase().replaceAll(' ', '').startsWith(value.toUpperCase().replaceAll(' ', ''))){
					searchedItems.push(item);
				}
			});	
				listsBlock.innerHTML = "";
				searchedItems.forEach(item =>{
					listsblock(listsBlock,item);
					createInfoBlock(data);
				});

				if(value === ""){
					listsBlock.innerHTML = "";
					createSearchblock(data,pageNum);
				}
		});
}	

function createListItem(data){
	const listsBlock = document.querySelector(".listsBlock");
	data.results.forEach(item => listsblock(listsBlock,item));
}

function listsblock (listsBlock,item){
	listsBlock.innerHTML+=`
			<div class="listItem">
				<p class="">${item.title}</p>
				<button class="infoBtn">info</button>
			</div>		
		`;
}

function createInfoBlock(data){
	const infoBtn = document.querySelectorAll(".infoBtn");
	infoBtn.forEach(btn => {
		btn.addEventListener("click",()=>{
			data.results.forEach(item => {
				if(btn.previousElementSibling.textContent === item.title){
					createInfo(item,data,pageNum);
				}
			});
		});
	});
}

function createInfo(item,data,pageNum){
	const listsBlock = document.querySelector(".listsBlock");  
	const inputBlock = document.querySelector(".inputBlock").innerHTML="";
			listsBlock.innerHTML = `
				<h4>Original Title</h4>
				<p>${item.original_title}</p><br><br>
				<h4>Summary</h4>
				<p>${item.overview}</p><br><br>
				<h4>Ratings</h4>
				<p>${item.vote_average}/10</p><br><br>
				<h4>Number of rates</h4>
				<p>${item.vote_count}</p><br><br>
				<button class="backBtn">Back</button>
			`;			
			const backBtn = document.querySelector(".backBtn");
			backBtn.addEventListener("click",() => {
				createSearchblock(data,pageNum);
				pages(pageNum);
			});
}

function pages(pageNum){
	const leftBtn = document.querySelector(".leftBtn");
	const rightBtn = document.querySelector(".rightBtn");
	leftBtn.addEventListener("click",()=>{
		if(pageNum === 1)pageNum = 16;
		if(pageNum>1)pageNum--;
		getDb(parametrs.filter,parametrs.path,parametrs.api_key,pageNum)
		.then(data => {createSearchblock(data,pageNum);}); 
	});
	rightBtn.addEventListener("click",()=>{
		if(pageNum === 15)pageNum = 0;
		if(pageNum<15)pageNum++;
		getDb(parametrs.filter,parametrs.path,parametrs.api_key,pageNum)
		.then(data => {createSearchblock(data,pageNum);}); 
	});
}