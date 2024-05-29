function displayUniversities(){
    $.ajax({
        url:"http://universities.hipolabs.com/search?country=United+States",
        method: "GET",
        dataType:"json",
        success: function(data){
            var uniList = $("#universitiesList");
            uniList.empty();

            $.each(data,function(index,universities){
                uniList.append(
                    `<div class="mb-3">
                    <h3>${universities.name}</h3>
                    <div>${universities.country}</div>
                    
                </div>
                <hr />
                `
                )
            })
        },
        error: function (error) {
            console.error("Error fetching stories:", error);
          },
    })
}