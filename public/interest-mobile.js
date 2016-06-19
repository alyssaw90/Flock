$(document).ready(function(){
	console.log('interest mobile js loaded');

	$('#interests').click(function(){
		// alert('interst button clicked!');
		$('.map-section').hide();
		$('.mobile-interests').show();
	});

	$('.backlink').click(function(){
		console.log('click working')
		$('.map-section').show();
		$('.mobile-interests').hide();
	})

	$(".circle").click(function(event){
		$(this).toggleClass("selected");
		$("#selectall").removeClass("hideselect");
		$("#selectall").addClass("showselect");
		$("#deselect").removeClass("showselect");
		$("#deselect").addClass("hideselect");

	});
	
	
	$("#selectall").click(function(event){
		$(".circle").addClass("selected");
		$("#selectall").addClass("hideselect");
		$("#selectall").removeClass("showselect");
		$("#deselect").addClass("showselect");
		$("#deselect").removeClass("hideselect");

	});

	
	$("#deselect").click(function(event){
		$(".circle").removeClass("selected");
		$("#selectall").removeClass("hideselect");
		$("#selectall").addClass("showselect");
		$("#deselect").removeClass("showselect");
		$("#deselect").addClass("hideselect");

	});

});