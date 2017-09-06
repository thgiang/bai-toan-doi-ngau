$(document).ready(function () {
    if (!localStorage.getItem('data')) {
        var data = {
            find: {
                mm: 'max',
                elements:
                    [
                        {elSign: '+', number: parseInt(Math.random() * 10)},
                        {elSign: '+', number: parseInt(Math.random() * 10)},
                    ]
            },
            constraints: [
                {
                    elements:
                        [
                            {elSign: '+', number: parseInt(Math.random() * 10)},
                            {elSign: '+', number: parseInt(Math.random() * 10)},
                        ],
                    sign: 0, number: parseInt(Math.random() * 100)
                },
                {
                    elements:
                        [
                            {elSign: '+', number: parseInt(Math.random() * 10)},
                            {elSign: '+', number: parseInt(Math.random() * 10)},
                        ],
                    sign: 1, number: parseInt(Math.random() * 100)
                }
            ],
            condition: ['-1', '1']
        };

        console.log(JSON.stringify(data));
        localStorage.setItem('data', JSON.stringify(data));
    } else {
        var data = JSON.parse(localStorage.getItem('data'));
    }

    var html = grid(data);
    $('#grid').html(html);


    // Add variable
    $('#app').on('click', '.add_variable', function(){
        var data = JSON.parse(localStorage.getItem('data'));
        data.find.elements.push({elSign: '+', number: parseInt(Math.random() * 10)});
        $.each(data.constraints, function(e, i){

            i.elements.push({elSign: '+', number: parseInt(Math.random() * 10)});
            console.log(i);
        });
        data.condition.push('-1');

        localStorage.setItem('data', JSON.stringify(data));
        //location.reload();
        var html = grid(data);
        $('#grid').html(html);
    });

    // Reset
    $('#app').on('click', '.reset', function(){
        localStorage.removeItem("data");
        location.reload();
    });

    // Add Constraint
    $('#app').on('click', '.add_constraint', function(){
        var data = JSON.parse(localStorage.getItem('data'));
        data.constraints.push(data.constraints[0]);
        localStorage.setItem('data', JSON.stringify(data));
        //location.reload();
        var html = grid(data);
        $('#grid').html(html);
    });

    // Rever sign
    $('#app').on('click', '.sign', function(){
        var data = JSON.parse(localStorage.getItem('data'));
        var newSign = revertSign($(this).data('sign'));
        $(this).text(newSign);
        var group = $(this).data('group');
        if (group === 'find')
        {
            data.find.elements[$(this).data('variable')].elSign = newSign;
        }
        else
        {
            data.constraints[$(this).data('constraint')].elements[$(this).data('variable')].elSign = newSign;
        }
        localStorage.setItem('data', JSON.stringify(data));
        //location.reload();
        var html = grid(data);
        $('#grid').html(html);
    });

    // constraint_sign
    $('#app').on('change', '.constraint_sign', function() {
        var data = JSON.parse(localStorage.getItem('data'));
        data.constraints[$(this).data('constraint')].sign = $(this).val();
        localStorage.setItem('data', JSON.stringify(data));
        var html = grid(data);
        $('#grid').html(html);
    });

});

function revertSign(sign)
{
    if (sign === '+') return '-';
    else return '+';
}
function grid(data) {
    console.log();
    var html = '';

    html += '<button class="add_variable">Thêm ẩn</button> &nbsp; <button class="add_constraint">Thêm ràng buộc</button> &nbsp; <button class="reset">Làm lại</button><br>';
    
    // Find
    html += 'Hàm mục tiêu:<br>';
    for (var i = 0; i < data.find.elements.length; i++)
    {
        html += '<div class="block">';
        html += '<input type="number" name="" value="' + data.find.elements[i].number + '" />';
        html += ' x<sub>' + (i + 1) + '</sub>';
        if (i !== Object.keys(data.find.elements).length - 1) {
            html += ' <span class="sign" data-group="find" data-variable="'+i+'" data-sign="' + data.find.elements[i].elSign + '">' + data.find.elements[i].elSign + '</span>';
        }
        html += '</div>';
    }
    html += ' -> <span class="find_min_max">'+data.find.mm+'</span><br>';

    html += 'Hệ ràng buộc: <br>';
    // Constraints
    for (i = 0; i < data.constraints.length; i++) {
        for (var j = 0; j < Object.keys(data.constraints[0].elements).length; j++) {
            html += '<div class="block" data-row="' + i + '" data-col="' + j + '">';
            html += '<input type="number" name="grid[' + i + '][' + j + ']" value="' + data.constraints[i].elements[j].number + '" />';
            html += ' x<sub>' + (j + 1) + '</sub>';
            if (j !== Object.keys(data.constraints[0].elements).length - 1) {
                html += ' <span class="sign" data-group="constraints" data-constraint="'+i+'" data-variable="'+j+'" data-sign="' + data.constraints[i].elements[j].elSign + '">' + data.constraints[i].elements[j].elSign + '</span>';
            }

            html += '</div>';
        }

        var selected = ['', '', ''];
        console.log(data.constraints[i].sign );
        if (parseInt(data.constraints[i].sign) === -1) {
            selected[0] = 'selected';
        }
        else if (parseInt(data.constraints[i].sign) === 1) {
            selected[1] = 'selected';
        }
        else {
            selected[2] = 'selected';
        }
        html += '<select class="constraint_sign" data-constraint="'+i+'">';
        html += '<option value="-1" ' + selected[0] + '>&le;</option>';
        html += '<option value="1" ' + selected[1] + '>&ge;</option>';
        html += '<option value="0" ' + selected[2] + '>=</option>';
        html += '</select>';

        html += ' <input type="number" name="" value="' + data.constraints[i].number + '" />';
        html += '<div class="clear"></div>';
    }

    html += 'Ràng buộc dấu: <br>';
    for (i = 0; i < data.find.elements.length; i++)
    {
        html += 'x<sub>' + (i + 1) + '</sub>';
        if (data.condition[i] === -1)
        {
            html += '&le; 0  ';
        }
        else {
            html += '&ge; 0  ';
        }
        html += '&nbsp; &nbsp;';
    }
    return html;
}