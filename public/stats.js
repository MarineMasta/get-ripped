// get all workout data from back-end

fetch("/api/workouts/range")
	.then((response) => {
		return response.json();
	})
	.then((data) => {
		populateChart(data);
	});

API.getWorkoutsInRange();

function generatePalette() {
	const arr = [
		"#003f5c",
		"#2f4b7c",
		"#665191",
		"#a05195",
		"#d45087",
		"#f95d6a",
		"#ff7c43",
		"ffa600",
		"#003f5c",
		"#2f4b7c",
		"#665191",
		"#a05195",
		"#d45087",
		"#f95d6a",
		"#ff7c43",
		"ffa600",
	];

	return arr;
}
function populateChart(data) {
	let totalD = totalDuration(data);
	let indivD = individualDurations(data);
	let totalW = calculateTotalWeight(data);
	let indivW = calculateIndivWeight(data);
	let workouts = workoutNames(data);
	const colors = generatePalette();

	let line = document.querySelector("#canvas").getContext("2d");
	let bar = document.querySelector("#canvas2").getContext("2d");
	let pie = document.querySelector("#canvas3").getContext("2d");
	let pie2 = document.querySelector("#canvas4").getContext("2d");

	let dayOfWeek = [
		"Sunday",
		"Monday",
		"Tuesday",
		"Wednesday",
		"Thursday",
		"Friday",
		"Saturday",
	];

	let dataDates = [];

	if (totalD.length > 10) {
		for (var i = 0; i < totalD.length; i++) {
			let d = new Date();
			d.setDate(new Date().getDate() - i);
			dataDates.push(dayOfWeek[d.getDay()]);
		}
	} else {
		for (var i = 1; i <= totalD.length; i++) {
			let d = new Date();
			d.setDate(new Date().getDate() - i);
			dataDates.push(dayOfWeek[d.getDay()]);
		}
	}

	dataDates.reverse();

	let lineChart = new Chart(line, {
		type: "line",
		data: {
			labels: dataDates,
			datasets: [
				{
					label: "Workout Duration In Minutes",
					backgroundColor: "red",
					borderColor: "red",
					data: totalD,
					fill: false,
				},
			],
		},
		options: {
			responsive: true,
			title: {
				display: true,
			},
			scales: {
				xAxes: [
					{
						display: true,
						scaleLabel: {
							display: true,
						},
					},
				],
				yAxes: [
					{
						display: true,
						scaleLabel: {
							display: true,
						},
					},
				],
			},
		},
	});

	let barChart = new Chart(bar, {
		type: "bar",
		data: {
			labels: dataDates,
			datasets: [
				{
					label: "Pounds",
					data: totalW,
					backgroundColor: [
						"rgba(255, 99, 132, 0.2)",
						"rgba(54, 162, 235, 0.2)",
						"rgba(255, 206, 86, 0.2)",
						"rgba(75, 192, 192, 0.2)",
						"rgba(153, 102, 255, 0.2)",
						"rgba(255, 159, 64, 0.2)",
						"rgba(39, 125, 161, 0.2)",
						"rgba(67, 170, 139, 0.2)",
						"rgba(255, 144, 179, 0.2)",
						"rgba(117, 117, 117, 0.2)",
						"rgba(192, 133, 82, 0.2)",
					],
					borderColor: [
						"rgba(255, 99, 132, 1)",
						"rgba(54, 162, 235, 1)",
						"rgba(255, 206, 86, 1)",
						"rgba(75, 192, 192, 1)",
						"rgba(153, 102, 255, 1)",
						"rgba(255, 159, 64, 1)",
						"rgba(39, 125, 161, 1)",
						"rgba(67, 170, 139, 1)",
						"rgba(255, 144, 179, 1)",
						"rgba(117, 117, 117, 1)",
						"rgba(192, 133, 82, 1)",
					],
					borderWidth: 1,
				},
			],
		},
		options: {
			title: {
				display: true,
				text: "Pounds Lifted",
			},
			scales: {
				yAxes: [
					{
						ticks: {
							beginAtZero: true,
						},
					},
				],
			},
		},
	});

	let pieChart = new Chart(pie, {
		type: "pie",
		data: {
			labels: workouts,
			datasets: [
				{
					label: "Excercises Performed",
					backgroundColor: colors,
					data: indivD,
				},
			],
		},
		options: {
			title: {
				display: true,
				text: "Excercises Performed - Duration",
			},
		},
	});

	let donutChart = new Chart(pie2, {
		type: "doughnut",
		data: {
			labels: workouts,
			datasets: [
				{
					label: "Excercises Performed",
					backgroundColor: colors,
					data: indivW,
				},
			],
		},
		options: {
			title: {
				display: true,
				text: "Excercises Performed - Pounds",
			},
		},
	});
}

function totalDuration(data) {
	let durations = [];

	data.forEach((workout) => {
		let totalDuration = 0;
		workout.exercises.forEach((exercise) => {
			totalDuration += exercise.duration;
		});
		durations.push(totalDuration);
	});

	return durations;
}

function individualDurations(data) {
	let durations = [];

	data.forEach((workout) => {
		workout.exercises.forEach((exercise) => {
			durations.push(exercise.duration);
		});
	});

	return durations;
}

function calculateTotalWeight(data) {
	let total = [];

	data.forEach((workout) => {
		let totalWeight = 0;
		workout.exercises.forEach((exercise) => {
			if (exercise.weight) {
				totalWeight += exercise.weight;
			}
		});
		total.push(totalWeight);
	});

	return total;
}

function calculateIndivWeight(data) {
	let total = [];

	data.forEach((workout) => {
		workout.exercises.forEach((exercise) => {
			total.push(exercise.weight);
		});
	});

	return total;
}

function workoutNames(data) {
	let workouts = [];

	data.forEach((workout) => {
		workout.exercises.forEach((exercise) => {
			workouts.push(exercise.name);
		});
	});

	return workouts;
}
