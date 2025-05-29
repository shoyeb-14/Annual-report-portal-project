$(document).ready(function () {
    let facultyData = [];
    let studentData = [];
    let departmentList = [];
    let trendData = {
        years: [],
        projects: [],
        papers: [],
        patents: [],
        funding: []
    };
    
    // Initialize Chart.js charts
    let yearlyTrendChart = null;
    let projectsComparisonChart = null;
    let papersComparisonChart = null;
    let fundingComparisonChart = null;
    let patentsComparisonChart = null;
    
    function initCharts() {
        // Destroy existing charts if they exist
        if (yearlyTrendChart) yearlyTrendChart.destroy();
        if (projectsComparisonChart) projectsComparisonChart.destroy();
        if (papersComparisonChart) papersComparisonChart.destroy();
        if (fundingComparisonChart) fundingComparisonChart.destroy();
        if (patentsComparisonChart) patentsComparisonChart.destroy();
        
        // Create new charts
        const yearlyTrendCtx = document.getElementById('yearlyTrendChart').getContext('2d');
        yearlyTrendChart = new Chart(yearlyTrendCtx, {
            type: 'line',
            data: {
                labels: trendData.years,
                datasets: [
                    {
                        label: 'Projects',
                        data: trendData.projects,
                        borderColor: '#4361ee',
                        backgroundColor: 'rgba(67, 97, 238, 0.1)',
                        borderWidth: 2,
                        tension: 0.3,
                        fill: true
                    },
                    {
                        label: 'Papers',
                        data: trendData.papers,
                        borderColor: '#4cc9f0',
                        backgroundColor: 'rgba(76, 201, 240, 0.1)',
                        borderWidth: 2,
                        tension: 0.3,
                        fill: true
                    },
                    {
                        label: 'Patents',
                        data: trendData.patents,
                        borderColor: '#f72585',
                        backgroundColor: 'rgba(247, 37, 133, 0.1)',
                        borderWidth: 2,
                        tension: 0.3,
                        fill: true
                    },
                    {
                        label: 'Funding (₹ Lakhs)',
                        data: trendData.funding.map(val => val / 100000),
                        borderColor: '#7209b7',
                        backgroundColor: 'rgba(114, 9, 183, 0.1)',
                        borderWidth: 2,
                        tension: 0.3,
                        fill: true,
                        yAxisID: 'y1'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Research Metrics Over Time',
                        font: {
                            size: 16,
                            weight: 'bold'
                        }
                    },
                    legend: {
                        position: 'top',
                        labels: {
                            boxWidth: 12,
                            padding: 20
                        }
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        callbacks: {
                            label: function(context) {
                                let label = context.dataset.label || '';
                                if (label.includes('Funding')) {
                                    return label + ': ₹' + context.parsed.y.toLocaleString('en-IN') + ' L';
                                }
                                return label + ': ' + context.parsed.y;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Count'
                        }
                    },
                    y1: {
                        beginAtZero: true,
                        position: 'right',
                        title: {
                            display: true,
                            text: 'Funding (₹ Lakhs)'
                        },
                        grid: {
                            drawOnChartArea: false
                        }
                    }
                }
            }
        });
        
        // Create department comparison charts
        const departments = facultyData.map(dept => dept.department);
        const projectsData = facultyData.map(dept => dept.total_projects);
        const papersData = facultyData.map(dept => dept.total_papers);
        const fundingData = facultyData.map(dept => dept.total_funding / 100000);
        
        const studentDepartments = studentData.map(dept => dept.department);
        const studentPapersData = studentData.map(dept => dept.total_papers);
        const patentsData = studentData.map(dept => dept.total_patents);
        
        // Projects Comparison Chart
        const projectsCtx = document.getElementById('projectsComparisonChart').getContext('2d');
        projectsComparisonChart = new Chart(projectsCtx, {
            type: 'bar',
            data: {
                labels: departments,
                datasets: [{
                    label: 'Research Projects',
                    data: projectsData,
                    backgroundColor: '#4361ee',
                    borderRadius: 5,
                    borderWidth: 1,
                    borderColor: 'rgba(0,0,0,0.1)'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                indexAxis: 'y',
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return context.parsed.x + ' projects';
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Number of Projects'
                        }
                    }
                }
            }
        });
        
        // Papers Comparison Chart
        const papersCtx = document.getElementById('papersComparisonChart').getContext('2d');
        papersComparisonChart = new Chart(papersCtx, {
            type: 'bar',
            data: {
                labels: departments,
                datasets: [
                    {
                        label: 'Faculty Papers',
                        data: papersData,
                        backgroundColor: '#4cc9f0',
                        borderRadius: 5,
                        borderWidth: 1,
                        borderColor: 'rgba(0,0,0,0.1)'
                    },
                    {
                        label: 'Student Papers',
                        data: studentPapersData,
                        backgroundColor: '#7209b7',
                        borderRadius: 5,
                        borderWidth: 1,
                        borderColor: 'rgba(0,0,0,0.1)'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                indexAxis: 'y',
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            boxWidth: 12,
                            padding: 20
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return context.dataset.label + ': ' + context.parsed.x;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Number of Papers'
                        }
                    }
                }
            }
        });
        
        // Funding Comparison Chart
        const fundingCtx = document.getElementById('fundingComparisonChart').getContext('2d');
        fundingComparisonChart = new Chart(fundingCtx, {
            type: 'bar',
            data: {
                labels: departments,
                datasets: [{
                    label: 'Funding (₹ Lakhs)',
                    data: fundingData,
                    backgroundColor: '#3f37c9',
                    borderRadius: 5,
                    borderWidth: 1,
                    borderColor: 'rgba(0,0,0,0.1)'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                indexAxis: 'y',
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return '₹ ' + context.parsed.x.toLocaleString('en-IN') + ' L';
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Funding (₹ Lakhs)'
                        }
                    }
                }
            }
        });

        // Patents Comparison Chart
        const patentsCtx = document.getElementById('patentsComparisonChart').getContext('2d');
        patentsComparisonChart = new Chart(patentsCtx, {
            type: 'bar',
            data: {
                labels: studentDepartments,
                datasets: [{
                    label: 'Patents Filed',
                    data: patentsData,
                    backgroundColor: '#f72585',
                    borderRadius: 5,
                    borderWidth: 1,
                    borderColor: 'rgba(0,0,0,0.1)'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                indexAxis: 'y',
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return context.parsed.x + ' patents';
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Number of Patents'
                        }
                    }
                }
            }
        });
    }

    // Load data from database
    function loadDataFromDB(selectedYear = null) {
        const year = selectedYear || $('#reportYear').val();

        // if (!year || isNaN(year)) {
        //     showError('Please select a valid year');
        //     return;
        // }
        
        $.ajax({
            url: 'api/fetch_research.php',
            type: 'GET',
            data: { year: year },
            dataType: 'json',
            success: function(response) {
                if (response.status === 'success') {
                    const departments = response.all_departments || [];
                    $('#departmentFilter').empty()
                    .append('<option value="">All Departments</option>')
                    .append(departments.map(dept => 
                        `<option value="${dept}">${dept}</option>`
                    ));
        
                // // Populate years
                const years = response.trend_data?.years || [];
                $('#reportYear').empty()
                    .append(years.map(year => 
                        `<option value="${year}">${year}</option>`
                    ));
            
        // Set default year to most recent if available
                // if (years.length > 0) {
                //     $('#reportYear').val(years[years.length - 1]);
                // }
                    facultyData = response.faculty_research;
                    studentData = response.student_research;
                    trendData = response.trend_data;
                    
                    // Extract department list
                    departmentList = facultyData.map(item => item.department);
                    
                    // Update department filter options
                    let departmentSelect = $('#departmentFilter');
                    departmentSelect.empty();
                    departmentSelect.append('<option value="">All Departments</option>');
                    departmentList.forEach(department => {
                        departmentSelect.append(`<option value="${department}">${department}</option>`);
                    });
                    
                    // Set current year badges
                    $('#faculty-year').text(year);
                    $('#student-year').text(year);
                    
                    // Update summary stats
                    updateSummaryStats();
                    
                    // Populate tables
                    populateFacultyTable();
                    populateStudentTable();
                    
                    // Load faculty and student research cards
                    loadResearchCards();
                    
                    // Initialize charts
                    initCharts();
                } else {
                    console.error('Error loading data:', response.message);
                    alert('Error loading data: ' + response.message);
                }
            },
            error: function(xhr, status, error) {
                console.error('AJAX Error:', error);
                alert('Error loading data. Please check console for details.');
            }
        });
    }

    // Update summary statistics
    function updateSummaryStats() {
        // Calculate totals
        const totalProjects = facultyData.reduce((sum, dept) => sum + parseInt(dept.total_projects), 0);
        const totalPapers = facultyData.reduce((sum, dept) => sum + parseInt(dept.total_papers), 0) +
                           studentData.reduce((sum, dept) => sum + parseInt(dept.total_papers), 0);
        const totalPatents = studentData.reduce((sum, dept) => sum + parseInt(dept.total_patents), 0);
        const totalFunding = facultyData.reduce((sum, dept) => sum + parseFloat(dept.total_funding), 0);
        const totalFaculty = facultyData.reduce((sum, dept) => sum + parseInt(dept.faculty_count), 0);
        
        // Format funding in crores/lakhs
        let formattedFunding = '';
        if (totalFunding >= 10000000) {
            formattedFunding = '₹' + (totalFunding / 10000000).toFixed(2) + ' Cr';
        } else {
            formattedFunding = '₹' + (totalFunding / 100000).toFixed(2) + ' L';
        }
        
        // Update summary cards
        $('#total-projects').text(totalProjects);
        $('#total-papers').text(totalPapers);
        $('#total-patents').text(totalPatents);
        $('#total-funding').text(formattedFunding);
        $('#faculty-involved').text(totalFaculty);
    }

    // Populate faculty research table
    function populateFacultyTable() {
        const tableBody = $('#faculty-table-body');
        tableBody.empty();
        
        facultyData.forEach(dept => {
            // Calculate performance bar width
            const performanceWidth = dept.performance_score + '%';
            
            // Format funding
            let formattedFunding = '';
            if (dept.total_funding >= 10000000) {
                formattedFunding = '₹' + (dept.total_funding / 10000000).toFixed(2) + ' Cr';
            } else {
                formattedFunding = '₹' + (dept.total_funding / 100000).toFixed(2) + ' L';
            }
            
            // Create table row
            const row = `
                <tr>
                    <td><strong>${dept.department}</strong></td>
                    <td>${dept.total_projects} <small class="text-muted">(${dept.ongoing_projects} ongoing)</small></td>
                    <td>${dept.total_papers} <small class="text-muted">(${dept.international_papers} intl.)</small></td>
                    <td>${formattedFunding}</td>
                    <td>
                        <div class="d-flex align-items-center">
                            <span class="me-2">${dept.performance_score}%</span>
                            <div class="progress-bar-container">
                                <div class="progress-bar-fill" style="width: ${performanceWidth};"></div>
                            </div>
                        </div>
                    </td>
                    <td>
                        <button class="btn btn-sm btn-outline-primary view-details" data-dept="${dept.department}">
                            <i class="fas fa-eye"></i> View
                        </button>
                        <button class="btn btn-sm btn-outline-success edit-data" data-type="faculty" data-dept="${dept.department}">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                    </td>
                </tr>
            `;
            
            tableBody.append(row);
        });
    }

    // Populate student research table
    function populateStudentTable() {
        const tableBody = $('#student-table-body');
        tableBody.empty();
        
        studentData.forEach(dept => {
            // Calculate performance bar width
            const performanceWidth = dept.performance_score + '%';
            
            // Create table row
            const row = `
                <tr>
                    <td><strong>${dept.department}</strong></td>
                    <td>${dept.total_papers} <small class="text-muted">(${dept.international_papers} intl.)</small></td>
                    <td>${dept.total_patents}</td>
                    <td>
                        <div class="d-flex align-items-center">
                            <span class="me-2">${dept.performance_score}%</span>
                            <div class="progress-bar-container">
                                <div class="progress-bar-fill" style="width: ${performanceWidth};"></div>
                            </div>
                        </div>
                    </td>
                    <td>
                        <button class="btn btn-sm btn-outline-primary view-details" data-dept="${dept.department}">
                            <i class="fas fa-eye"></i> View
                        </button>
                        <button class="btn btn-sm btn-outline-success edit-data" data-type="student" data-dept="${dept.department}">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                    </td>
                </tr>
            `;
            
            tableBody.append(row);
        });
    }

    // Load faculty and student research cards
    function loadResearchCards() {
        const facultyContainer = $('#faculty-research');
        const studentContainer = $('#student-research');
        
        facultyContainer.empty();
        studentContainer.empty();
        
        // Load faculty research cards
        facultyData.forEach(dept => {
            const card = `
                <div class="col-md-6 col-lg-4 mb-4">
                    <div class="card h-100">
                        <div class="dept-name">${dept.department}</div>
                        <div class="chart-container">
                            <div class="stat-item">
                                <div class="stat-label"><i class="fas fa-book"></i> Total Projects</div>
                                <div class="stat-value">${dept.total_projects}</div>
                            </div>
                            <div class="stat-item">
                                <div class="stat-label"><i class="fas fa-tasks"></i> Ongoing Projects</div>
                                <div class="stat-value">${dept.ongoing_projects}</div>
                            </div>
                            <div class="stat-item">
                                <div class="stat-label"><i class="fas fa-check-circle"></i> Completed Projects</div>
                                <div class="stat-value">${dept.completed_projects}</div>
                            </div>
                            <div class="stat-item">
                                <div class="stat-label"><i class="fas fa-file-alt"></i> Total Papers</div>
                                <div class="stat-value">${dept.total_papers}</div>
                            </div>
                            <div class="stat-item">
                                <div class="stat-label"><i class="fas fa-globe"></i> International Papers</div>
                                <div class="stat-value">${dept.international_papers}</div>
                            </div>
                            <div class="stat-item">
                                <div class="stat-label"><i class="fas fa-flag"></i> National Papers</div>
                                <div class="stat-value">${dept.national_papers}</div>
                            </div>
                            <div class="stat-item">
                                <div class="stat-label"><i class="fas fa-rupee-sign"></i> Total Funding</div>
                                <div class="stat-value">₹${(dept.total_funding/100000).toFixed(2)}L</div>
                            </div>
                            <div class="stat-item">
                                <div class="stat-label"><i class="fas fa-users"></i> Faculty</div>
                                <div class="stat-value">${dept.faculty_count}</div>
                            </div>
                            <div class="d-grid mt-2">
                                <button class="btn btn-sm btn-outline-primary view-details" data-dept="${dept.department}">
                                    <i class="fas fa-chart-bar me-1"></i> View Details
                                </button>
                                <button class="btn btn-sm btn-outline-success mt-2 edit-data" data-type="faculty" data-dept="${dept.department}">
                                    <i class="fas fa-edit me-1"></i> Edit Data
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            facultyContainer.append(card);
        });
        
        // Load student research cards
        studentData.forEach(dept => {
            const card = `
                <div class="col-md-6 col-lg-4 mb-4">
                    <div class="card h-100">
                        <div class="dept-name">${dept.department}</div>
                        <div class="chart-container">
                            <div class="stat-item">
                                <div class="stat-label"><i class="fas fa-file-alt"></i> Total Papers</div>
                                <div class="stat-value">${dept.total_papers}</div>
                            </div>
                            <div class="stat-item">
                                <div class="stat-label"><i class="fas fa-globe"></i> International Papers</div>
                                <div class="stat-value">${dept.international_papers}</div>
                            </div>
                            <div class="stat-item">
                                <div class="stat-label"><i class="fas fa-flag"></i> National Papers</div>
                                <div class="stat-value">${dept.national_papers}</div>
                            </div>
                            <div class="stat-item">
                                <div class="stat-label"><i class="fas fa-lightbulb"></i> Patents Filed</div>
                                <div class="stat-value">${dept.total_patents}</div>
                            </div>
                            <div class="d-grid mt-2">
                                <button class="btn btn-sm btn-outline-primary view-details" data-dept="${dept.department}">
                                    <i class="fas fa-chart-bar me-1"></i> View Details
                                </button>
                                <button class="btn btn-sm btn-outline-success mt-2 edit-data" data-type="student" data-dept="${dept.department}">
                                    <i class="fas fa-edit me-1"></i> Edit Data
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            studentContainer.append(card);
        });
    }

    // Filter handler
    $('#applyFilter').on('click', function() {
        const selectedYear = $('#reportYear').val();
        const selectedDepartment = $('#departmentFilter').val();
        const selectedResearchType = $('#researchType').val();
        
        loadDataFromDB(selectedYear);
        
        if (selectedDepartment) {
            $('#faculty-research .card').each(function() {
                if ($(this).find('.dept-name').text() === selectedDepartment) {
                    $(this).parent().show();
                } else {
                    $(this).parent().hide();
                }
            });
            
            $('#student-research .card').each(function() {
                if ($(this).find('.dept-name').text() === selectedDepartment) {
                    $(this).parent().show();
                } else {
                    $(this).parent().hide();
                }
            });
        } else {
            $('#faculty-research .card').parent().show();
            $('#student-research .card').parent().show();
        }
        
        const toast = new bootstrap.Toast(document.getElementById('filterToast'));
        toast.show();
    });

    // Search handler
    $('#searchInput').on('keyup', function() {
        const searchTerm = $(this).val().toLowerCase();
        
        // Filter faculty cards
        $('#faculty-research .card').each(function() {
            const cardText = $(this).text().toLowerCase();
            if (cardText.includes(searchTerm)) {
                $(this).parent().show();
            } else {
                $(this).parent().hide();
            }
        });
        
        // Filter student cards
        $('#student-research .card').each(function() {
            const cardText = $(this).text().toLowerCase();
            if (cardText.includes(searchTerm)) {
                $(this).parent().show();
            } else {
                $(this).parent().hide();
            }
        });
        
        // Filter faculty table rows
        $('#faculty-table tbody tr').each(function() {
            const rowText = $(this).text().toLowerCase();
            if (rowText.includes(searchTerm)) {
                $(this).show();
            } else {
                $(this).hide();
            }
        });
        
        // Filter student table rows
        $('#student-table tbody tr').each(function() {
            const rowText = $(this).text().toLowerCase();
            if (rowText.includes(searchTerm)) {
                $(this).show();
            } else {
                $(this).hide();
            }
        });
    });

    // Export report functionality
    $('#exportData').on('click', function() {
        // Create a toast notification
        const toastHTML = `
            <div class="toast align-items-center text-white bg-success border-0" role="alert" aria-live="assertive" aria-atomic="true" id="exportToast">
                <div class="d-flex">
                    <div class="toast-body">
                        <i class="fas fa-check-circle me-2"></i> Report export initiated. The file will be downloaded shortly.
                    </div>
                    <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
                </div>
            </div>
        `;
        
        $('body').append(toastHTML);
        const toast = new bootstrap.Toast(document.getElementById('exportToast'));
        toast.show();
        
        // Remove toast after it hides
        $('#exportToast').on('hidden.bs.toast', function () {
            $(this).remove();
        });
    });

    // Print functionality
    $('#printData').on('click', function() {
        window.print();
    });

    // New Research button
     // New Research button
$('#newResearchBtn').on('click', function () {
    // Modal HTML
    const modalHTML = `
        <div class="modal fade" id="newResearchModal" tabindex="-1" aria-labelledby="newResearchModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="newResearchModalLabel"><i class="fas fa-plus-circle me-2"></i> Add New Research</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <form id="newResearchForm">
                            <div class="row mb-3">
                                <div class="col-md-6">
                                    <label for="researchTitle" class="form-label">Research Title</label>
                                    <input type="text" class="form-control" id="researchTitle" required>
                                </div>
                                <div class="col-md-6">
                                    <label for="researchDept" class="form-label">Department</label>
                                    <select class="form-select" id="researchDept" required>
                                        <option value="">Select Department</option>
                                        ${departmentList.map(dept => `<option value="${dept}">${dept}</option>`).join('')}
                                    </select>
                                </div>
                            </div>
                            <div class="row mb-3">
                                <div class="col-md-6">
                                    <label for="researchType" class="form-label">Research Type</label>
                                    <select class="form-select" id="researchType" required>
                                        <option value="">Select Type</option>
                                        <option value="faculty">Faculty Research</option>
                                        <option value="student">Student Research</option>
                                    </select>
                                </div>
                                <div class="col-md-6">
                                    <label for="researchStatus" class="form-label">Status</label>
                                    <select class="form-select" id="researchStatus" required>
                                        <option value="">Select Status</option>
                                        <option value="ongoing">Ongoing</option>
                                        <option value="completed">Completed</option>
                                        <option value="planned">Planned</option>
                                    </select>
                                </div>
                            </div>
                            <div class="mb-3">
                                <label for="researchDesc" class="form-label">Description</label>
                                <textarea class="form-control" id="researchDesc" rows="3" required></textarea>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-primary" id="submitResearch">Submit</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    $('body').append(modalHTML);
    const modal = new bootstrap.Modal(document.getElementById('newResearchModal'));
    modal.show();

    $('#newResearchModal').on('hidden.bs.modal', function () {
        $(this).remove();
    });

    $('#submitResearch').on('click', function () {
        const title = $('#researchTitle').val().trim();
        const dept = $('#researchDept').val();
        const type = $('#researchType').val();
        const status = $('#researchStatus').val();
        const desc = $('#researchDesc').val().trim();

        if (!title || !dept || !type || !status || !desc) {
            alert('Please fill all required fields');
            return;
        }

        // Dummy data for demo — replace this with input fields if needed
        const postData = {
            type: type,
            year: new Date().getFullYear(),
            data: {
                title: title,
                department: dept,
                status: status,
                description: desc,
                total_projects: Math.floor(Math.random() * 10 + 5),
                ongoing_projects: Math.floor(Math.random() * 5 + 2),
                completed_projects: Math.floor(Math.random() * 5 + 2),
                total_papers: Math.floor(Math.random() * 20 + 5),
                international_papers: Math.floor(Math.random() * 10 + 3),
                national_papers: Math.floor(Math.random() * 10 + 3),
                total_funding: Math.floor(Math.random() * 500000 + 100000),
                faculty_count: Math.floor(Math.random() * 10 + 5),
                performance_score: Math.floor(Math.random() * 20 + 70),
                total_patents: Math.floor(Math.random() * 5)
            }
        };

        $.ajax({
            url: 'api/update_research.php',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(postData),
            success: function (response) {
                if (response.status === 'success') {
                    alert('Research project submitted successfully!');
                    modal.hide();
                    // Optional: Reload data on page
                    loadMockData(); // or your dynamic fetch function
                } else {
                    alert('Error: ' + response.message);
                }
            },
            error: function (xhr, status, error) {
                alert('AJAX error: ' + error);
            }
        });
    });
});


    // View details button handler (delegated event)
    $(document).on('click', '.view-details', function() {
        const dept = $(this).data('dept');
        alert(`Showing details for ${dept} department`);
        // In a real app, this would open a detailed view or modal
    });

    // Edit data button handler
    $(document).on('click', '.edit-data', function() {
        const type = $(this).data('type');
        const dept = $(this).data('dept');
        
        let dataToEdit;
        if (type === 'faculty') {
            dataToEdit = facultyData.find(item => item.department === dept);
        } else {
            dataToEdit = studentData.find(item => item.department === dept);
        }
        
        if (!dataToEdit) return;
        
        // Create edit modal
        const modalHTML = `
            <div class="modal fade" id="editDataModal" tabindex="-1" aria-labelledby="editDataModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="editDataModalLabel">
                                <i class="fas fa-edit me-2"></i> Edit ${type === 'faculty' ? 'Faculty' : 'Student'} Research Data - ${dept}
                            </h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <form id="editDataForm">
                                ${type === 'faculty' ? `
                                <div class="row mb-3">
                                    <div class="col-md-4">
                                        <label for="totalProjects" class="form-label">Total Projects</label>
                                        <input type="number" class="form-control" id="totalProjects" value="${dataToEdit.total_projects}" required>
                                    </div>
                                    <div class="col-md-4">
                                        <label for="ongoingProjects" class="form-label">Ongoing Projects</label>
                                        <input type="number" class="form-control" id="ongoingProjects" value="${dataToEdit.ongoing_projects}" required>
                                    </div>
                                    <div class="col-md-4">
                                        <label for="completedProjects" class="form-label">Completed Projects</label>
                                        <input type="number" class="form-control" id="completedProjects" value="${dataToEdit.completed_projects}" required>
                                    </div>
                                </div>
                                                                <div class="row mb-3">
                                    <div class="col-md-4">
                                        <label for="totalPapers" class="form-label">Total Papers</label>
                                        <input type="number" class="form-control" id="totalPapers" value="${dataToEdit.total_papers}" required>
                                    </div>
                                    <div class="col-md-4">
                                        <label for="internationalPapers" class="form-label">International Papers</label>
                                        <input type="number" class="form-control" id="internationalPapers" value="${dataToEdit.international_papers}" required>
                                    </div>
                                    <div class="col-md-4">
                                        <label for="nationalPapers" class="form-label">National Papers</label>
                                        <input type="number" class="form-control" id="nationalPapers" value="${dataToEdit.national_papers}" required>
                                    </div>
                                </div>
                                <div class="row mb-3">
                                    <div class="col-md-6">
                                        <label for="totalFunding" class="form-label">Total Funding (₹)</label>
                                        <input type="number" class="form-control" id="totalFunding" value="${dataToEdit.total_funding}" required>
                                    </div>
                                    <div class="col-md-6">
                                        <label for="facultyCount" class="form-label">Faculty Count</label>
                                        <input type="number" class="form-control" id="facultyCount" value="${dataToEdit.faculty_count}" required>
                                    </div>
                                </div>
                                ` : `
                                <div class="row mb-3">
                                    <div class="col-md-4">
                                        <label for="totalPapers" class="form-label">Total Papers</label>
                                        <input type="number" class="form-control" id="totalPapers" value="${dataToEdit.total_papers}" required>
                                    </div>
                                    <div class="col-md-4">
                                        <label for="internationalPapers" class="form-label">International Papers</label>
                                        <input type="number" class="form-control" id="internationalPapers" value="${dataToEdit.international_papers}" required>
                                    </div>
                                    <div class="col-md-4">
                                        <label for="nationalPapers" class="form-label">National Papers</label>
                                        <input type="number" class="form-control" id="nationalPapers" value="${dataToEdit.national_papers}" required>
                                    </div>
                                </div>
                                <div class="row mb-3">
                                    <div class="col-md-6">
                                        <label for="totalPatents" class="form-label">Patents Filed</label>
                                        <input type="number" class="form-control" id="totalPatents" value="${dataToEdit.total_patents}" required>
                                    </div>
                                </div>
                                `}
                                <div class="row mb-3">
                                    <div class="col-md-6">
                                        <label for="performanceScore" class="form-label">Performance Score (%)</label>
                                        <input type="number" class="form-control" id="performanceScore" min="0" max="100" value="${dataToEdit.performance_score}" required>
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Cancel</button>
                            <button type="button" class="btn btn-primary" id="saveChanges">Save Changes</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        $('body').append(modalHTML);
        const modal = new bootstrap.Modal(document.getElementById('editDataModal'));
        modal.show();
        
        // Handle modal cleanup after close
        $('#editDataModal').on('hidden.bs.modal', function () {
            $(this).remove();
        });
        
        // Handle save changes
        $('#saveChanges').on('click', function() {
            const year = $('#reportYear').val();
            const updatedData = {
                department: dept,
                performance_score: $('#performanceScore').val()
            };
            
            if (type === 'faculty') {
                updatedData.total_projects = $('#totalProjects').val();
                updatedData.ongoing_projects = $('#ongoingProjects').val();
                updatedData.completed_projects = $('#completedProjects').val();
                updatedData.total_papers = $('#totalPapers').val();
                updatedData.international_papers = $('#internationalPapers').val();
                updatedData.national_papers = $('#nationalPapers').val();
                updatedData.total_funding = $('#totalFunding').val();
                updatedData.faculty_count = $('#facultyCount').val();
            } else {
                updatedData.total_papers = $('#totalPapers').val();
                updatedData.international_papers = $('#internationalPapers').val();
                updatedData.national_papers = $('#nationalPapers').val();
                updatedData.total_patents = $('#totalPatents').val();
            }
            
            // In a real app, this would send to backend to update database
            $.ajax({
                url: 'api/update_research.php',
                type: 'POST',
                data: {
                    type: type,
                    year: year,
                    data: JSON.stringify(updatedData)
                },
                dataType: 'json',
                success: function(response) {
                    if (response.status === 'success') {
                        // Show success toast
                        const toastHTML = `
                            <div class="toast align-items-center text-white bg-success border-0" role="alert" aria-live="assertive" aria-atomic="true" id="updateToast">
                                <div class="d-flex">
                                    <div class="toast-body">
                                        <i class="fas fa-check-circle me-2"></i> Data updated successfully!
                                    </div>
                                    <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
                                </div>
                            </div>
                        `;
                        $('body').append(toastHTML);
                        const toast = new bootstrap.Toast(document.getElementById('updateToast'));
                        toast.show();
                        
                        // Remove toast after it hides
                        $('#updateToast').on('hidden.bs.toast', function () {
                            $(this).remove();
                        });
                        
                        // Reload data
                        loadDataFromDB(year);
                        modal.hide();
                    } else {
                        alert('Error updating data: ' + response.message);
                    }
                },
                error: function(xhr, status, error) {
                    alert('Error updating data. Please check console for details.');
                    console.error('AJAX Error:', error);
                }
            });
        });
    });

    // Tab change event handlers
    $('#comparisonTabs button').on('click', function(e) {
        e.preventDefault();
        $(this).tab('show');
    });

    // Sort by name handler
    $('#sortByName').on('click', function(e) {
        e.preventDefault();
        facultyData.sort((a, b) => a.department.localeCompare(b.department));
        studentData.sort((a, b) => a.department.localeCompare(b.department));
        populateFacultyTable();
        populateStudentTable();
        loadResearchCards();
        initCharts();
    });

    // Sort by performance handler
    $('#sortByPerformance').on('click', function(e) {
        e.preventDefault();
        facultyData.sort((a, b) => b.performance_score - a.performance_score);
        studentData.sort((a, b) => b.performance_score - a.performance_score);
        populateFacultyTable();
        populateStudentTable();
        loadResearchCards();
        initCharts();
    });

    // Show all departments handler
    $('#showAllDepts').on('click', function(e) {
        e.preventDefault();
        $('#departmentFilter').val('');
        $('#faculty-research .card').parent().show();
        $('#student-research .card').parent().show();
    });

    // Initialize the dashboard
    loadDataFromDB();
    
    // Add filter toast element (hidden by default)
    $('body').append(`
        <div class="position-fixed bottom-0 end-0 p-3" style="z-index: 11">
            <div class="toast align-items-center text-white bg-primary border-0" role="alert" aria-live="assertive" aria-atomic="true" id="filterToast">
                <div class="d-flex">
                    <div class="toast-body">
                        <i class="fas fa-filter me-2"></i> Filters applied successfully
                    </div>
                    <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
                </div>
            </div>
        </div>
    `);
});