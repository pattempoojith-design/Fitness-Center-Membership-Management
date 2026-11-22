
let members = [
    {name:"Kiran Kumar", id:"PF101", plan:"Premium", date:"2026-11-01", cost:1999, status:"Active", favorite:false},
    {name:"Sanjay Reddy", id:"PF102", plan:"Basic", date:"2026-11-05", cost:999, status:"Active", favorite:false},
    {name:"Anjali Sharma", id:"PF103", plan:"Elite", date:"2026-11-08", cost:2999, status:"Active", favorite:false},
    {name:"Rahul Varma", id:"PF104", plan:"Basic", date:"2026-11-10", cost:999, status:"Expired", favorite:false}
];

let attendance = [];
let allocations = {};
let revenue = 0;

document.getElementById("currentDate").textContent =
    new Date().toLocaleDateString("en-IN");

function displayMembers() {
    let search = document.getElementById("memberSearch").value.toLowerCase();
    let filter = document.getElementById("memberFilter").value;

    let filtered = members.filter(m =>
        (m.name.toLowerCase().includes(search) ||
         m.id.toLowerCase().includes(search)) &&
        (filter === "all" || m.status === filter)
    );

    document.getElementById("memberTable").innerHTML =
        filtered.map(m => `
        <tr>
            <td>${m.name}</td>
            <td>${m.id}</td>
            <td>${m.plan}</td>
            <td>${m.date}</td>
            <td>₹${m.cost}</td>
            <td><span class="status ${m.status === "Expired" ? "expired" : ""}">${m.status}</span></td>
            <td><button class="favorite" onclick="toggleFavorite('${m.id}')">${m.favorite ? "★" : "☆"}</button></td>
        </tr>`).join("");

    updateDropdowns();
    updateDashboard();
}


// MEMBERSHIP PRICES

const planPrices = {
    Basic: 999,
    Premium: 1999,
    Elite: 2999
};

// OPEN REGISTRATION FORM

function openMemberForm() {

    document.getElementById("memberForm").reset();

    document.getElementById("formCost").textContent = "₹0";

    document.getElementById("joiningDate").value =
        new Date().toISOString().slice(0, 10);

    document.getElementById("memberModal").classList.add("show");
}

// SELECT PLAN AND OPEN FORM

function selectPlan(plan, cost) {

    openMemberForm();

    document.getElementById("memberPlan").value = plan;

    updatePlanCost();
}

// UPDATE MEMBERSHIP COST

function updatePlanCost() {

    let plan = document.getElementById("memberPlan").value;

    let duration = Number(
        document.getElementById("memberDuration").value
    );

    let price = planPrices[plan] || 0;

    let total = price * duration;

    document.getElementById("formCost").textContent =
        "₹" + total.toLocaleString("en-IN");
}

// CLOSE POPUP

function closeMemberForm() {

    document.getElementById("memberModal").classList.remove("show");

}

// REGISTER MEMBER

document.getElementById("memberForm").addEventListener("submit",
function(event) {

    event.preventDefault();

    let name = document.getElementById("memberName").value.trim();
    let phone = document.getElementById("memberPhone").value.trim();
    let email = document.getElementById("memberEmail").value.trim();
    let age = Number(document.getElementById("memberAge").value);

    let plan = document.getElementById("memberPlan").value;

    let date = document.getElementById("joiningDate").value;

    let duration = Number(
        document.getElementById("memberDuration").value
    );

    if (!name || !phone || !email || !plan || !date) {
        alert("Please fill in all required details.");
        return;
    }

    if (!planPrices[plan] || !date || !duration) {
        alert("Please select a valid membership plan and duration.");
        return;
    }

    let cost = planPrices[plan] * duration;

    let newMember = {

        name: name,
        id: "PF" + (101 + members.length),
        phone: phone,
        email: email,
        age: age,
        plan: plan,
        date: date,
        duration: duration,
        cost: cost,
        status: "Active",
        favorite: false

    };

    members.push(newMember);

    displayMembers();

    closeMemberForm();

    alert("Congratulations! Member registered successfully.");

});

// CLOSE POPUP WHEN CLICKING OUTSIDE

document.getElementById("memberModal").addEventListener("click",
function(event) {

    if (event.target.id === "memberModal") {
        closeMemberForm();
    }

});

function toggleFavorite(id) {
    let member = members.find(m => m.id === id);
    member.favorite = !member.favorite;
    displayMembers();
}

function updateDashboard() {
    document.getElementById("totalMembers").textContent = members.length;
    document.getElementById("totalTrainers").textContent = 12;
    document.getElementById("totalAttendance").textContent = attendance.length;
    document.getElementById("totalRevenue").textContent =
        "₹" + (revenue + members.filter(m => m.status === "Active").reduce((sum,m) => sum + m.cost, 0)).toLocaleString("en-IN");
}

function updateDropdowns() {
    let options = '<option value="">Select Member</option>' +
        members.map(m => `<option value="${m.id}">${m.name}</option>`).join("");

    document.getElementById("allocateMember").innerHTML = options;
    document.getElementById("attendanceMember").innerHTML = options;
}


function allocateTrainer() {
    let memberId = document.getElementById("allocateMember").value;
    let trainer = document.getElementById("allocateTrainer").value;

    if (!memberId || !trainer) {
        alert("Please select both member and trainer.");
        return;
    }

    allocations[memberId] = trainer;
    let member = members.find(m => m.id === memberId);

    document.getElementById("allocationResult").textContent =
        trainer + " successfully assigned to " + member.name;
}

function joinClass(button) {
    button.textContent = "Joined";
    button.disabled = true;
    alert("You have joined the class!");
}

function favorite(button) {
    if (button.textContent.includes("Save")) {
        button.textContent = "★ Saved";
    } else {
        button.textContent = "♡ Save";
    }
}

function markAttendance() {
    let id = document.getElementById("attendanceMember").value;

    if (!id) {
        alert("Please select a member.");
        return;
    }

    let member = members.find(m => m.id === id);
    let today = new Date().toLocaleDateString("en-IN");

    let alreadyMarked = attendance.some(a =>
        a.id === id && a.date === today
    );

    if (alreadyMarked) {
        alert("Attendance already marked for today!");
        return;
    }

    let time = new Date().toLocaleTimeString("en-IN");

    attendance.push({
        id:id,
        name:member.name,
        date:today,
        time:time
    });

    document.getElementById("attendanceTable").innerHTML =
        attendance.map(a => `
        <tr>
            <td>${a.name}</td>
            <td>${a.date}</td>
            <td>${a.time}</td>
            <td><span class="status">Present</span></td>
        </tr>`).join("");

    document.getElementById("attendanceMessage").textContent =
        "Attendance successfully recorded for " + member.name;

    updateDashboard();
}

function shareWebsite() {
    if (navigator.share) {
        navigator.share({
            title:"PULSEFIT Fitness Center",
            text:"Check out the PULSEFIT Fitness Management System!",
            url:window.location.href
        }).catch(() => {});
    } else {
        navigator.clipboard.writeText(window.location.href)
            .then(() => alert("Website link copied!"))
            .catch(() => alert("Unable to copy link."));
    }
}

document.getElementById("memberSearch").addEventListener("input", displayMembers);
document.getElementById("memberFilter").addEventListener("change", displayMembers);

displayMembers();
