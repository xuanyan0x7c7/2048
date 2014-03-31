var coprime = function(x, y) {
	var t;
	if (x > y) {
		t = x; x = y; y = t;
	}
	while (x >= 2) {
		t = y % x; y = x; x = t;
	}
	return x == 1;
}

var phi = function(n) {
	var x = 0;
	for (var i = 1; i <= n; ++i) {
		if (coprime(i, n)) {
			++x;
		}
	}
	return x;
};

var sigma = function(n) {
	var sum = 0;
	for (var i = 1; i <= n; ++i) {
		if (n % i == 0) {
			sum += i;
		}
	}
	return sum;
}
