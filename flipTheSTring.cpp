#include <bits/stdc++.h>
using namespace std;

int main() {
	int t; cin>>t;
	while(t--){
	    string s1,s2;
	    cin>>s1>>s2;
	    int n=s1.size();
	    int e=0,o=0;
	    for(int i=0;i<n;){
	        if(s1[i]!=s2[i]){
	        while(s1[i]!=s2[i] && i<n){
	            i=i+2;
	        }
	        e++;
	        }
	        else{
	            i=i+2;
	        }
	    }
	    for(int i=1;i<n;){
	        if(s1[i]!=s2[i]){
	        while(s1[i]!=s2[i] && i<n){
	            i=i+2;
	        }
	        o++;
	        }
	        else{
	            i=i+2;
	        }
	    }
	    cout<<(e+o)<<"\n";
	}
	return 0;
}
