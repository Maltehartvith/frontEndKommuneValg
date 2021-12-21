//Her sætter jeg min requestmappings api som en constant, da url'en bruges flere gange og derved gør det nemmere
//samt gemmer den disse informationer så længe man har en session kørende.
sessionStorage.setItem("CANDIDATES_URL", "http://localhost:8080/api/candidates");
const CANDIDATES_URL = sessionStorage.getItem("CANDIDATES_URL");

// Metode der laver rækkerne i tabellen inden på index siden (candidate-table-body).
function makeRows() {
    const rows = cache.getAll().map(c => `
         <tr>
           <td id="name-for-table">${c.name}</td>
           <td>${c.party}</td>
           <td>${c.votes}</td>
           <td>
           <button data-id-delete=${c.id} class="btn-danger" style="color: black" href="#">Slet</button>
           <button data-id-edit='${c.id}' class="btn-warning" style="color: black" href="#">Rediger</button> 
           </td>       
         </tr>
        `)
    document.getElementById("candidate-table-body").innerHTML = rows.join("")
}

//Metode som laver elementerne inde i datalisten, et pr parti, samt også er med til at kunne
//sortere i listen - det kommer længere nede
function makeDatalist() {
    const unique = [...new Set(cache.getAll().map(candidate => candidate.party))];
    const startOption = `<option>Alle</option>`
    const rows = unique.map(a => ` 
        <option>${a}</option>
    `)
    document.getElementById("party-list").innerHTML = rows.join("")
    document.getElementById("party-sort-list").innerHTML = startOption + rows.join("")
}


function localCache() {
    let data = []
    const addEdit = (candidate, method) => {
        if (method === "POST") {
            data.push(candidate)
        } else if (method === "PUT") {
            data = data.map(c => c.id == candidate.id ? candidate : c)
        }
    }
    return {
        getAll: () => data, //This is the same as above
        addAll: (all) => data = all,
        deleteOne: (id) => data = data.filter(c => c.id !== Number(id)),
        findById: (id) => data.find(c => c.id == id),
        addEdit: addEdit
    }
}

//Setup handlers
function setUpHandlers() {
    document.getElementById("candidate-table-body").onclick = handleTableClick
    document.getElementById("btn-save-candidate").onclick = saveCandidate
    document.getElementById("btn-add-candidate").onclick = makeNewCandidate
    document.getElementById("party-sort-list").onchange = fetchPartyCandidates
    document.getElementById("modal-chart-button").onclick = showChartModal

}

setUpHandlers()

//click handlers
function handleTableClick(evt) {
    evt.preventDefault()
    evt.stopPropagation()
    const target = evt.target;
    //Handler til delete
    if (target.dataset.idDelete) {
        const idToDelete = Number(target.dataset.idDelete)
        const options = {
            method: "DELETE",
            headers: {'Accept': 'application/json'},
        }
        fetch(CANDIDATES_URL + "/" + idToDelete, options)
            .then(res => {
                if (res.ok) {
                    cache.deleteOne(idToDelete)
                    makeRows()
                    drawChart()
                }
            })
    }
    //Handler til edit
    if (target.dataset.idEdit) {
        const idToEdit = Number(target.dataset.idEdit)
        const candidate = cache.findById(idToEdit)
        showModal(candidate)
    }
}

//Tom modal, hvor en kandidats fields sat klar
function makeNewCandidate() {
    showModal({
        id: null,
        name: "",
        party: "",
        votes: ""
    })
}

//Hvis modal, her er der tale om edit, hvor alle værdierne til kandidaten med det pågældende id's værdier bliver sat
//ind i diverse input fælter
function showModal(candidate) {
    const myModal = new bootstrap.Modal(document.getElementById('candidate-modal'))
    document.getElementById("modal-title-candidate").innerText = candidate.id ? "Rediger kandidat" : "Tilføj kandidat"
    document.getElementById("candidate-id").innerText = candidate.id
    document.getElementById("input-name").value = candidate.name
    document.getElementById("party").value = candidate.party
    makeDatalist()
    document.getElementById("input-votes").value = candidate.votes
    myModal.show()
}

//En lille metode som gør det muligt at lave en modal til pie chart
function showChartModal() {
    const myModal = new bootstrap.Modal(document.getElementById('modal-chart'))
    myModal.show()
}

//Gem kandidat, alt efter om det er edit eller create
function saveCandidate() {
    const candidate = {}
    candidate.id = Number(document.getElementById("candidate-id").innerText)
    candidate.name = document.getElementById("input-name").value
    candidate.party = document.getElementById("party").value
    candidate.votes = document.getElementById("input-votes").value
    const method = candidate.id ? "PUT" : "POST"
    const url = (method === "PUT") ? CANDIDATES_URL + "/" + candidate.id : CANDIDATES_URL
    const options = {
        method: method,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(candidate)
    }
    fetch(url, options)
        .then(res => {
            if (!res.ok) {
                throw "Der var noget, som gik galt, tjek dine inputs"
            }
            return res.json()
        })
        .then(candidate => {
            cache.addEdit(candidate, method)
            makeRows()
            window.location.replace("index.html")
        })
        .catch(e => alert(e))
}

//Fetch alle kandidaterne, samt sætte dem i tabellen og så også datalist, så den bliver opdateret
function fetchCandidates() {
    fetch(CANDIDATES_URL)
        .then(res => res.json())
        .then(data => {
            cache.addAll(data)
            makeRows()
            makeDatalist()
        })
}

//Fetcher alle de kandidater som er inde for det valgte parti. Det er i sammenhæng med party-select-list som sortere
//listen efter et bestemt parti
function fetchPartyCandidates() {
    //Det samme som den overstående, men bare hvis man har valgt muligheden "alle"
    const party = document.getElementById("party-sort-list").value
    if (document.getElementById("party-sort-list").value === "Alle") {
        fetchCandidates()
    } else {
        //Her skrives den rigtigt ud hvor den sortere via findByParty metoden fra rest
        // og laver en ny tabel med de repræsenterede kandidater
        fetch(CANDIDATES_URL + "/party/" + party)
            .then(res => res.json())
            .then(data => {
                cache.addAll(data)
                makeRows()
            })
    }
}

const cache = localCache()
fetchCandidates()
