function loadContent(page, content) {
    document.getElementById('content').innerHTML = content;
}

const pages = {
    'expenses': `<div>
        <h2>지출 관리</h2>
        <button id='createExpense'>지출 추가</button>
        <button id='getExpenses'>지출 내역 조회</button>
        <div id='expenseResults'></div>
    </div>` ,
    'goals': `<div>
        <h2>목표 관리</h2>
        <button id='createGoal'>목표 추가</button>
        <button id='getGoals'>목표 조회</button>
        <div id='goalResults'></div>
    </div>` ,
    'account': `<div>
        <h2>사용자 계정</h2>
        <button id='login'>로그인</button>
        <button id='register'>회원가입</button>
    </div>` 
};

function navigate(page) {
    if (pages[page]) {
        loadContent(page, pages[page]);
        attachEventHandlers();
    }
}

function attachEventHandlers() {
    // TODO: Add event handlers for each button in the loaded content
    document.getElementById('createExpense')?.addEventListener('click', () => alert('지출 추가 기능'));
    document.getElementById('getExpenses')?.addEventListener('click', fetchExpenses);

    document.getElementById('createGoal')?.addEventListener('click', () => alert('목표 추가 기능'));
    document.getElementById('getGoals')?.addEventListener('click', () => alert('목표 조회 기능'));

    document.getElementById('login')?.addEventListener('click', () => alert('로그인 기능'));
    document.getElementById('register')?.addEventListener('click', () => alert('회원가입 기능'));
}

function fetchExpenses() {
    fetch('http://localhost:8000/expenses')
        .then(response => response.json())
        .then(data => {
            document.getElementById('expenseResults').innerHTML = '<pre>' + JSON.stringify(data, null, 2) + '</pre>';
        })
        .catch(error => console.error('Error fetching expenses:', error));
}

// 기본 페이지를 로드합니다.
navigate('expenses');