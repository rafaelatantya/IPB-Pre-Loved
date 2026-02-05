#include <iostream>
#include <iomanip>
using namespace std;
int main()
{
 long long int a,b,c,d;
 cin >> a >> b >> c>> d;

 double avg = (a+b+c+d)/4.0;
 cout << fixed << setprecision(2) << avg << endl;
 
}