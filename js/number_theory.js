var phi = function(n) {
	var x = n;
	for (var i = 2; i*i <= n; i+=1+i%2)
	if ( n % i == 0){
		x=x/i*(i-1);
		while(n%i==0)n/=i;
	}
	if(n>1)x=x/n*(n-1);
	return x;
};

var sigma = function(n) {
	var sum = 1,tmp;
	for (var i = 2; i*i <= n; i+=1+i%2) {
		tmp = 1;
		for ( ;n % i ==0; n/=i) tmp =tmp*i+1;
		sum*=tmp;
	}
	if(n>1)sum*=(n+1);
	return sum;
}
