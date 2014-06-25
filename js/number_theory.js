var phi = function(n) {
	var x = n;
	if (n % 2 == 0) {
		x /= 2;
		do {
			n /= 2;
		} while (n % 2 == 0);
	}
	for (var p = 3; p * p <= n; p += 2) {
		if (n % p == 0) {
			x = x / p * (p - 1);
			do {
				n /= p;
			} while (n % p == 0);
		}
	}
	if (n > 1) {
		x = x / n * (n - 1);
	}
	return x;
};

var sigma = function(n) {
	var sum = 1;
	var t = 1;
	if (n % 2 == 0) {
		do {
			n /= 2;
			t = t * 2 + 1;
		} while (n % 2 == 0);
		sum *= t;
	}
	for (var p = 3; p * p <= n; p += 2) {
		t = 1;
		if (n % p == 0) {
			do {
				n /= p;
				t = t * p + 1;
			} while (n % p == 0);
			sum *= t;
		}
	}
	if (n > 1) {
		sum *= n + 1;
	}
	return sum;
};
