const JsonResponse = module.exports = {
    Success: function(msg, res){
        var jsonResponse = {
            'meta': {
                'code': 200,
                'message': msg
            }
        }

        res.json(jsonResponse);
        res.end();
    },
    SuccessWithData: function(value, msg, res){
        var jsonResponse = {
            'meta': {
                'code': 200,
                'message': msg
            },
            'data': value
        }

        res.json(jsonResponse);
        res.end();
    },
    Failed: function (msg, res) {
        var jsonResponse = {
            'meta': {
                'code': 400,
                'message': msg
            }
        }

        res.json(jsonResponse);
        res.end();
    },
    FailedWithData: function (value, msg, res) {
        var jsonResponse = {
            'meta': {
                'code': 400,
                'message': msg
            },
            'data': value
        }

        res.json(jsonResponse);
        res.end();
    }
}