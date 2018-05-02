var factMult=[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]; // Facteur multiplicatif des X
var dataDict = {};
var nomX=[];
var betaDict = {};
var nbBeta = 29;

function setGraph(){
	d3.queue(5)
		.defer(d3.csv, "data/puechabon/acp/X_par_heure.csv",d3.values)
		.defer(d3.csv, "data/puechabon/acp/data_stand.csv",d3.values)
		.defer(d3.csv, "data/puechabon/acp/vec_propre.csv",d3.values)
		.defer(d3.csv, "data/puechabon/acp/beta_eq.csv",d3.values)
		.defer(d3.csv, "data/puechabon/SLIDERS/factMult_origin.csv",d3.values)
		.await(function(error,X_par_heure,data_stand,vec_propre,beta_eq,factMult_origin){
			if (error){
				console.error('erreur defer'+ error);
			}
			else{
				calcul(X_par_heure,data_stand,vec_propre,beta_eq,factMult_origin);
			}
		});    
    
    function calcul(X_par_heure,data_stand,vec_propre,beta_eq,factMult_origin){ 
			for  (var i=0;i<28;i++) {
    			for  (var j=1;j<49;j++) {
    				
    				var ValueModif=Number(X_par_heure[i][j])*factMult[i];

    				
    				if (ValueModif<factMult_origin[i][4]) {
    				X_par_heure[i][j]=Number(factMult_origin[i][4]);
    				}	
    				
    				else if (ValueModif>factMult_origin[i][5]) {
    				X_par_heure[i][j]=Number(factMult_origin[i][5]);
    				}
    				
    				else {
    				X_par_heure[i][j]=ValueModif;
    				}
    		}}
	   	// TRANSPOSE############
    	var transpose=d3.transpose(X_par_heure); 
    	//NORMALISE ############   
    	var data=[];
    	for (var TIME=1;TIME<49;TIME++) {
    		var dim1=[];
    		var dim2=[];
    		var dim3=[];
	    	transpose[TIME].forEach(
	    		function NORM(value,i){
	    			var CR=(value-data_stand[i][1])/data_stand[i][2] ; //CENTRER REDUIT
	    			dim1.push(CR*vec_propre[i][1]);
	    			dim2.push(CR*vec_propre[i][2]);
	    			dim3.push(CR*vec_propre[i][3]);
	    	});
	    	
	    	var data_DIM=[];
	    	data_DIM.push(d3.sum(dim1),d3.sum(dim2),d3.sum(dim3));
	    	var Y=data_DIM[0]*beta_eq[0][1]+data_DIM[1]*beta_eq[1][1]+data_DIM[2]*beta_eq[2][1]+Number(beta_eq["columns"][1]);
	    	
			if (Y<0) { // limite à 0
	    		Y=0;
	    	}
			if (transpose[TIME][4] <10){Y=0}; // Met 0 qd pas de lumiere
			Y = Y * 0.065; //Changement unités
	    	
			data.push(Y);

	}
	for(i=0;i<nbBeta;i++){
		nomX.push(X_par_heure[i][0]);}
		sliders(nomX);
		Courbe(data);
	}
}