angular.module('iu',[])
/**
 * 通用查询条件指令
 * @author huk/2015.08.18
 * @description
 * 1.compact属性区分行内和行二种显示模式，分别对应统计、记录二种应用模式;
 *   compact模式暂时取第1项为外置，否则最多取前3项外置；
 * 2.option:{
 *    fields:[option关键字],如：['datetime','ip','imsi','calling']
 *    Granularity:{---时间粒度，为空时时间控件默认为"秒值"模式
 *      level:Month\Day\Hour\Minute
 *      intervale:分钟粒度（5、10、15、30）
 *    }
 *    mutex:是否全局互斥，有且必须仅有一个条件结果
 *    rules:[['imsi','calling']],互斥组：n选1规则，只允许其中一个条件有值
 *    showPanel:是否显示下拉面板按钮
 *    showQuery:是否显示外置查询按钮
 *    outCount:外置控件数量
 * }
 */
    .directive('iuQueryForm', ['$compile', 'localizeService', 'queryService', 'queryConfig', function ($compile, localizeService, queryService, queryConfig) {
        'use strict';
        return {
            restrict: 'E',
            template: function (elm, attrs) {
                var formId = 'queryForm' + queryService.uniqueId();
                var body =
                    '<div class="dropdown-menu pull-right option-body">' +
                    '    <div class="option-header">' +
                    '        <span class="option-header-title" data-iu-localize="Query_Header_Title">Query Option</span>' +
                    '        <span title="" class="option-header-control text-info selecter option-hide" style="float: right;margin-right: 25px">' +
                    '            <i class="fa fa-lg fa-times"></i>' +
                    '        </span>' +
                    '    </div>' +
                    '    <div class="option-items">' +
                    '        <div class="option-items-content">' +
                    '             <div class="row" data-iu-query-field field="field" data-ng-repeat="field in ::innerFields track by $index" ng-class="{\'has-error\': field.showError}">' +
                    '             </div>' +
                    '        </div>' +
                    '        <div class="option-result">' +
                    '            <div class="option-result-content">' +
                    '                <label data-iu-localize="Query_Result_Title">Options:</label>' +
                    '                <div>' +
                    '                    <data-iu-result-item result="result" id="$index" data-ng-repeat="result in results"></data-iu-result-item>' +
                    '                </div>' +
                    '            </div>' +
                    '            <div class="option-result-control">' +
                    '                <div class="btn-group">' +
                    '                    <a class="btn btn-xs btn-default option-result-control-sql">SQL</a>' +
                    '                </div>' +
                    '            </div>' +
                    '        </div>' +
                    '        <div class="option-addon">' +
                    '            <div class="option-addon-item option-sql animated fadeInRight" style="margin: 15px">' +
                    '                <div>SQL语句：</div>' +
                    '                <div>&nbsp;&nbsp;{{sql}}</div>' +
                    '            </div>' +
                    '        </div>' +
                    '    </div>' +
                    '     <div class="option-control">' +
                    '        <div class="option-function">' +
                    '            <div class="btn-group">' +
                        //'                <button class="btn btn-sm btn-default">SQL</button>' +
                    '                <button disabled class="btn btn-sm btn-default"><span data-iu-localize="Common_Save">Save</span></button>' +
                    '                <button disabled class="btn btn-sm btn-default dropdown-toggle"  data-toggle="dropdown" tabindex="-1"><span class="caret"></span></button>' +
                    '                <ul class="dropdown-menu pull-right" role="menu">' +
                    '                    <li><a href="javascript:void(0);" data-iu-localize="Common_Load">Load</a></li>' +
                    '                </ul>' +
                    '            </div>' +
                    '            <div class="option-function-control">' +
                    '                <button class="btn btn-sm btn-function btn-primary btn-query" data-ng-disabled="{0}.$invalid || !sql" data-ng-click="innerQuery()"><span data-iu-localize="Common_Query">Query</span></button>' +
                    '                <button class="btn btn-sm btn-function btn-default btn-cancel"><span data-iu-localize="Common_Cancel">Cancel</span></button>' +
                    '            </div>' +
                    '        </div>' +
                    '    </div>' +
                    '</div>';
                var block =
                    '<div class="query-option" data-name="{0}">' +
                    '    <form name="{0}" role="form">' +
                    '    <div class="option-outer dropdown">' +
                    '        <div class="option-outer-content form-inline">' +
                    '             <div data-replace="1" data-iu-query-field field="field" data-ng-repeat="field in ::outerFields track by $index" ng-class="{\'has-error\': field.showError}" class="option-item-outer">' +
                    '            </div>' +
                    '            <div class="form-group query-panel-control query-panel">' +
                    '                <span tooltip="其它条件设置" style="display:inline-block;float: right;border: 1px solid #bfbfbf;padding: 5px 10px;margin: 0 10px" class="dropdown-toggle selecter" data-autoclose="false" data-toggle="dropdownpanel">' +
                    '                    <i class="fa fa-cog"></i>' +
                    '                </span>' +
                    '                {1}' +
                    '            </div>' +
                    '            <div class="form-group outer-query-control display-none">' +
                    '                <button class="btn btn-sm btn-primary btn-query" data-ng-disabled="{0}.$invalid || !sql" data-ng-click="innerQuery()">' +
                    '                    <span data-iu-localize="Common_Query">Query</span>' +
                    '                </button>' +
                    '            </div>' +
                    '            <div class="form-group outer-query-control">' +
                    '                <ng-transclude></ng-transclude>' +
                    '            </div>' +
                    '        </div>' +
                    '    </div>' +
                    '    </form>' +
                    '</div>';
                var inline =
                    '<div class="form-inline query-option" data-name="{0}">' +
                    '    <form name="{0}" role="form">' +
                    '    <div class="form-group option-outer-compact">' +
                    '        <div class="input-group dropdown query-panel">' +
                    '             <div  data-iu-query-field field="field" data-ng-repeat="field in ::outerFields track by $index" ng-class="{\'has-error\': field.showError}">' +
                    '            </div>' +
                    '            <span class="add-on input-group-addon dropdown-toggle selecter query-panel-control" data-toggle="dropdownpanel" data-autoclose="false" tooltip="其它条件设置">' +
                    '                <i class="fa fa-cog"></i>' +
                    '            </span>' +
                    '            {1}' +
                    '        </div>' +
                    '    </div>' +
                    '    </form>' +
                    '</div>';
                if (attrs.compact) {
                    return inline.format(formId, body.format(formId));
                } else {
                    return block.format(formId, body.format(formId));
                }
            },
            replace: true,
            transclude: true,
            scope: {
                option: '=',
                query: '&'
            },
            require: 'iuQueryForm',
            controller: function ($scope, $attrs) {
                var datetimeField, watch, isInitialize = false, uiFunc, ctrl = this, rules;
                $scope.results = [];
                $scope.sql = $scope.sql || '';
                watch = $scope.$watch('option', function (newValue, oldValue) {
                    if ((newValue && !isInitialize) || newValue !== oldValue) {
                        initialize();
                        watch();
                    }
                });

                function initialize() {
                    setupOption();
                    setupFields();
                    setupForm();
                    setupRules();
                    initializeResults();
                    if (uiFunc) {
                        uiFunc();
                    }
                    isInitialize = true;

                    function setupOption() {
                        $scope.fields = queryConfig.gets($scope.option.fields);
                        $scope.option.$updateGranularity = function (granuarity, minute) {
                            if (datetimeField) {
                                datetimeField.granularity = {
                                    level: granuarity,
                                    interval: framework.toNumber(minute)
                                };
                            }
                        };
                        $scope.option.$getResult = function () {
                            var rule = checkRule();
                            $scope.option.$result.isValid = $scope.formId.$valid && rule.result;
                            if (!rule.result) {
                                $scope.option.$result.message = rule.message;
                            } else if (!$scope.option.$result.isValid) {
                                $scope.option.$result.message = '存在无效条件值';
                            } else {
                                $scope.option.$result.message = null;
                            }

                            return angular.extend({}, $scope.option.$result);
                        };
                        $scope.option.$result = {
                            isValid: false,
                            sql: ''
                        };
                    }

                    function setupFields() {
                        var count = 3;
                        if ($scope.option.outCount) {
                            count = framework.toNumber($scope.option.outCount);
                        } else if ($attrs.compact) {
                            count = 1;
                        } else {
                            count = $scope.fields.length > 3 ? 3 : $scope.fields.length;
                        }
                        $scope.innerFields = $scope.fields.slice(count);
                        $scope.outerFields = $scope.fields.slice(0, count);
                        $scope.outerFields.forEach(function (item) {
                            item.$compactOuter = !!$attrs.compact;
                            item.$outer = true;
                        });

                        if ($scope.option.granularity) {
                            datetimeField = $scope.fields.first(function (item) {
                                return item.fieldType === framework.datatype.datetime;
                            });
                            if (datetimeField) {
                                datetimeField.granularity = $scope.option.granularity;
                                if ($scope.option.interval) {
                                    datetimeField.interval = $scope.option.interval;
                                }
                            }
                        }
                    }

                    function setupForm() {
                        $scope.formId = $scope[$attrs.name];
                        $scope.option.$result.isValid = $scope.formId.$valid;
                        $scope.fields.forEach(function (item) {
                            item.formController = $scope.formId;
                        });
                        for (var i = 0; i < $scope.fields.length; i++) {
                            $scope.fields[i].$form = ctrl;
                        }
                    }

                    function setupRules() {
                        var field;
                        if ($scope.option.mutex) {
                            for (var i = 0; i < $scope.fields.length; i++) {
                                $scope.fields[i].rules = [];
                                for (var y = 0; y < $scope.fields.length; y++) {
                                    if (y !== i) {
                                        $scope.fields[i].rules.push($scope.fields[y]);
                                    }
                                }
                            }
                        } else if ($scope.option.rules && $scope.option.rules.length > 0) {
                            rules = [];
                            $scope.option.rules.forEach(function (item) {
                                field = $scope.fields.first(function (field) {
                                    return field.id === item;
                                });
                                if (field) {
                                    rules.push(field);
                                }
                            });
                        }
                    }

                    /**
                     * initialize result info.
                     * @private
                     */
                    function initializeResults() {

                    }
                }

                function checkRule() {
                    var result = {
                        result: true
                    };
                    if ($scope.option.mutex) {
                        result = checkUnHaveMulitValue($scope.fields);
                    }

                    if (rules && rules.length > 0) {
                        result = checkUnHaveMulitValue(rules);
                    }
                    return result;

                    function hasValue(model) {
                        return typeof model !== 'undefined' && model !== null && model !== '';
                    }

                    function checkUnHaveMulitValue(rules) {
                        var temp = 0, i, fields, message;
                        for (i = 0; i < rules.length; i++) {
                            if (hasValue(rules[i].model)) {
                                temp++;
                                if (temp >= 2) {
                                    break;
                                }
                            }
                        }
                        if (temp !== 1) {
                            fields = rules.map(function (item) {
                                return item.caption;
                            }).join();
                            message = temp === 0 ? '字段：[{0}]必须输入一个条件值'.format(fields) : '字段：[{0}]只允许输入一个条件值'.format(fields);
                        }

                        return {
                            result: temp === 1,
                            message: message
                        };
                    }
                }

                /**
                 * check rule of fields
                 * @param field
                 * @param statue -other fields have or don't hvae value
                 */
                this.checkFieldRule = function (field, statue) {
                    return statue;
                };

                /**
                 * update result
                 */
                this.update = function () {
                    //console.log('update:' + field.caption);
                    if ($scope.option.$result) {
                        $scope.option.$result.isValid = $scope.formId.$valid && checkRule();
                    } else {
                        $scope.option.$result = {
                            isValid: $scope.formId.$valid && checkRule()
                        };
                    }

                    $scope.sql = queryService.generateSQL($scope.fields);
                    $scope.option.$result.sql = $scope.sql;
                    console.log('SQL update:' + $scope.sql);
                    updateResults();

                    function updateResults() {
                        $scope.results = [];
                        $scope.fields.forEach(function (item) {
                            if (item.model) {
                                var result = queryService.toResult(item)(item.model);
                                if (result) {
                                    $scope.results.push(new ResultItem(item.caption, result, item));
                                }
                            }
                        });
                    }
                };
                /**
                 * registe ui func
                 * @param func
                 */
                this.registe = function (func) {
                    uiFunc = func;
                };

                /**
                 * 条件结果项
                 * @param caption
                 * @param value
                 * @param field
                 * @constructor
                 */
                function ResultItem(caption, value, field) {
                    this.caption = caption;
                    this.value = value;
                    this.field = field;
                }

                /**
                 * Delete item by index.
                 * @param index
                 */
                ResultItem.prototype.delete = function (index) {
                    if ($scope.results && $scope.results.length > index) {
                        $scope.results.splice(index, 1);
                    }
                    if (this.field) {
                        this.field.model = null;
                        if (this.field.$onRested) {
                            this.field.$onRested();
                        }
                    }
                };
            },
            link: function (scope, element, attrs, ctrl) {
                var currentAddon, appendAddons;
                regiestAddons();
                initializeEvents();
                scope.innerQuery = function () {
                    console.log('innerQuery');
                    var result = scope.option.$getResult();
                    if (scope.query) {
                        scope.query(result);
                    }
                };
                ctrl.registe(setupForm);
                function setupForm() {
                    if (scope.option.showQuery) {
                        element.find('.outer-query-control').removeClass('display-none');
                    }
                    if (framework.hasValue(scope.option.showPanel) && !scope.option.showPanel) {
                        element.find('.query-panel-control').addClass('display-none');
                    }
                }

                /**
                 * Addon regiest
                 */
                function regiestAddons() {

                }

                /**
                 * Event initialization
                 */
                function initializeEvents() {
                    // panel control
                    element.find('.btn-function').click(function () {
                        element.find('.query-panel').removeClass('open');
                    });

                    // addon control
                    element.find('.option-header-control').click(function () {
                        element.find('.option-addon').removeClass('option-show');
                        element.find('.option-header-title').text(localizeService.get('Query_Header_Title'));
                        $(this).addClass('option-hide');
                        if (currentAddon) {
                            element.find('.option-items').removeClass(currentAddon);
                        }
                    });
                    // SQL control
                    element.find('.option-result-control-sql').click(function () {
                        switchAddon('option-sql', localizeService.get('Query_SQLGroup'));
                    });
                    // appendAddons
                    if (appendAddons && appendAddons.length > 0) {
                        appendAddons.map(function (item) {
                            //'.btn-addon-' + item.name + '-control'
                            element.find(item.controlName).click(function () {
                                switchAddon(item.key, item.caption);
                            });
                        });
                    }
                }

                /**
                 * switch addon panel
                 * @param name -the id of the addon
                 * @param caption - the addon caption
                 */
                function switchAddon(name, caption) {
                    element.find('.option-addon-item').removeClass('option-show').addClass('option-hide');
                    element.find('.' + name).addClass('option-show');
                    element.find('.option-header-control').removeClass('option-hide');
                    element.find('.option-addon').addClass('option-show');
                    element.find('.option-header-title').text(caption);
                    if (currentAddon) {
                        $('.option-items').removeClass(currentAddon);
                    }
                    currentAddon = 'option-items-' + name;
                    element.find('.option-items').addClass(currentAddon);
                }
            }
        };
    }])
/**
 * query field
 * @author huk/2015.08.18
 */
    .directive('iuQueryField', ['$compile', '$timeout', 'queryService', function ($compile, $timeout, queryService) {
        'use strict';
        return {
            restrict: 'EA',
            require: '^iuQueryForm',
            replace: function (elm, attrs) {
                return !!attrs.replace;
            },
            controller: function ($scope) {
                var field = $scope.field;
                setFieldAttribute();
                initialValue();

                function setFieldAttribute() {

                }

                /**
                 * initial model
                 */
                function initialValue() {
                    //TODO:validation
                    if (angular.isFunction(field.value)) {
                        field.model = field.value();
                    } else if (angular.isDefined(field.value)) {
                        field.model = field.value;
                    }
                }
            },
            link: function (scope, element, attrs, ctrl) {
                addAttributesAndClasses();
                setFieldIdAndName();
                getFieldTemplate();
                watchControl();

                function addAttributesAndClasses() {
                    if (scope.field.attributes) {
                        element.attr(scope.field.attributes);
                    }
                    if (scope.field.class) {
                        element.addClass(scope.field.class);
                    }
                }

                function setFieldIdAndName() {
                    scope.form = scope.field.formController;
                }

                function setupTemplate(field) {
                    var templateWarp;
                    var requiredSpan = '<span class="required">*</span>';
                    var help = '', temp,
                        required = field.required ? 'required' : '',
                        isOuter = field.$outer ? 'outer="true"' : '',
                        allowMultiValue = field.allowMultiValue ? 'allowMultiValue="true"' : '';
                    if (scope.field.help) {
                        help = '<i class="fa fa-question-circle hand query-option-question" tooltip-Placement="bottom" tooltipAppendToBody="true" tooltip-html-unsafe="' + scope.field.help + '"></i>';
                    }
                    if (field.directive) {
                        temp = '<data-{0} field="field" {1} {2} {3}></data-{0}>'.format(queryService.toSnake(field.directive), required, isOuter, allowMultiValue);
                    } else {
                        temp = field.template;
                    }

                    if (field.$compactOuter) {
                        return temp;
                    } else if (field.$outer) {
                        //style="width: 100px;text-align: center"
                        templateWarp =
                            '<div class="form-group">' +
                            '    <label class="option-outer-field-title" title="{{::field.caption}}">{{::field.caption}} {0}</label>' +
                            '    {1}' +
                            '</div>';
                        return templateWarp.format(scope.field.required ? requiredSpan : '', temp);
                    } else {
                        templateWarp = '<label>{{::field.caption}}{0}{1}<i class="fa fa-info-circle query-option-error hand" tooltipAppendToBody="true" tooltip-Placement="bottom" data-ng-if="field.error" tooltip="{{field.error}}"></i></label>{2}';
                        return templateWarp.format(scope.field.required ? requiredSpan : '', help, temp);
                    }
                }

                /**
                 * 1.Template：提示信息、取反；
                 * 2.错误信息输出;
                 * 3.sql输出；
                 * 4.数据校验
                 */
                function getFieldTemplate() {
                    var template = setupTemplate(scope.field);
                    element.html(template);
                    $compile(element.contents())(scope);
                    var ngModelNodes = element.find('[ng-model],[data-ng-model],data-ng-model');
                    if (ngModelNodes.length > 0) {
                        scope.field.$ngModel = $(ngModelNodes[0]).data('$ngModelController');
                    }
                }

                function watchControl() {
                    var remove = angular.noop;
                    watchFieldExistence(scope.field.name);

                    function watchFieldExistence(name) {
                        var unwatch = scope.$watch('form["' + name + '"]', function formControlChange(formControl) {
                            if (formControl) {
                                scope.fc = scope.field.fc = formControl;
                                remove();
                                modelWatcher();
                                addParsersAndFormatters();
                                unwatch();
                            }
                        });
                    }

                    function modelWatcher() {
                        remove = scope.$watch(function () {
                            return scope.fc.$invalid;
                        }, function (show) {
                            scope.showError = scope.field.showError = show;
                        });
                    }

                    function addParsersAndFormatters() {
                        appendModelPipline('parser');
                        appendModelPipline('formatter');
                        scope.fc.$viewChangeListeners.push(fieldUpdatedWatcher);
                    }

                    function appendModelPipline(name) {
                        var things, which = '$' + name + 's';
                        var func = scope.field[name] || queryService[name](scope.field);

                        if (angular.isArray(func)) {
                            things = func;
                            if (name === 'parser') {
                                things.unshift(messageParser);
                            }
                        } else if (name === 'parser') {
                            things = [messageParser, func.bind(scope.field)];
                        }
                        else {
                            things = [func.bind(scope.field), messageParser];
                        }
                        scope.fc[which] = scope.fc[which].concat(things);
                    }

                    function fieldUpdatedWatcher(value) {
                        $timeout(function () {
                            ctrl.update(scope.field);
                        });

                        return value;
                    }

                    function messageParser(value) {
                        if (scope.field.error) {
                            scope.field.error = null;
                        }
                        return value;
                    }
                }
            }
        };
    }])
/**
 * item of queryOption result
 * @authro huk/2015.08.23
 */
    .directive('iuResultItem', [function () {
        'use strict';
        return {
            restrict: 'E',
            replace: true,
            template: '<span title="{{::result.value}}"><a href="javascript:void(0);">{{::result.caption}}:&nbsp;<strong>{{::result.value}}</strong><b tooltip="删除" data-ng-click="delete()"></b></a></span>',
            scope: {
                result: '=',
                id: '='
            },
            
            link: function (scope) {
                scope.delete = function () {
                    scope.result.delete(scope.id);
                };
            }
        };
    }])
/**
 * validation of query control
 * @author huk/2015.08.21
 */
    .directive('iuQueryValidation', ['queryService', function (queryService) {
        'use strict';
        return {
            restrict: 'A',
            require: 'ngModel',
            controller: function ($scope) {
            },
            link: function (scope, element, attrs, ctrl) {
                initializeFieldValidator();
                appendValidatorPipline();

                function initializeFieldValidator() {
                    if (scope.field.validators) {
                        if (!angular.isArray(scope.field.validators)) {
                            scope.field.validators = [scope.field.validators];
                        }
                    } else {
                        var validators = queryService.getValidator(scope.field);
                        scope.field.validators = queryService.toArray(validators);
                    }
                }

                function appendValidatorPipline() {
                    if (scope.field.validators) {
                        angular.forEach(scope.field.validators, addValidatorToPipeline.bind(null, false));
                    }
                    if (scope.field.asyncValidators) {
                        angular.forEach(scope.field.asyncValidators, addValidatorToPipeline.bind(null, true));
                    }
                }

                function addValidatorToPipeline(isAsync, validator, name) {
                    setupMessage(validator, name);
                    validator = angular.isObject(validator) ? validator.expression : validator;
                    setupWithValidators(validator, name, isAsync);
                }

                function setupMessage(validator, name) {

                }

                function setupWithValidators(validator, name, isAsync) {
                    var validatorCollection = isAsync ? '$asyncValidators' : '$validators';
                    ctrl[validatorCollection][name] = function (modelValue, viewValue) {
                        var result = queryService.execute(scope.field, validator, modelValue, viewValue);
                        if (result.message) {
                            scope.field.error = scope.field.error ? scope.field.error + result.message : result.message;
                            return result.result;
                        } else {
                            return result;
                        }
                    };
                }
            }
        };
    }])
/**
 * data process for inner control
 * @author huk/2015.10.10
 */
    .directive('iuQueryInnerData', ['queryService', function (queryService) {
        'use strict';
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function (scope, element, attrs, ctrl) {
                var field = {
                  fieldType:  scope.field.fieldType,
                    dataFormat:scope.field.dataFormat
                };
                ctrl.$validators.data = function (model, value) {
                    var validator, result;
                    validator = queryService.getValidator(field);
                    result = validator(model, value, field);
                    return result.message ? false : true;
                };
                ctrl.$parsers.push(queryService.parser(scope.$config || field));
            }
        };
    }])
/**
 * query utility service
 * @author huk/2015.08.18
 */
    .factory('queryService', ['localizeService', 'serviceUtil', '$q', function (localizeService, serviceUtil, $q) {
        'use strict';
        var cache = [], outTime = 30 * 60 * 1000,id = 1;
        return {
            uniqueId: function(){
              return id++;
            },
            /**
             * execute value
             * @param scope
             * @param expression
             * @param $modelValue
             * @param $viewValue
             * @returns {*}
             */
            execute: function (scope, expression, $modelValue , $viewValue) {
                if (angular.isFunction(expression)) {
                    return expression($modelValue, $viewValue, scope);
                } else {
                    return scope.$eval(expression, angular.extend({$viewValue: $viewValue, $modelValue: $modelValue}));
                }
            },
            /**
             * generate SQL.
             * @param fields - options
             * @param groups - sql reslation
             */
            generateSQL: function (fields, groups) {
                //TODO:TOPN,Group,
                return fields.reduce(function (sql, option) {
                    var result = fieldToSQL(option);
                    if (result) {
                        if (sql) {
                            sql += ' AND ' + result;
                        } else {
                            sql = result;
                        }
                    }
                    return sql;
                }, '');

                function fieldToSQL(field) {
                    if (field.model) {
                        var result, data = generateValues(field);
                        if (angular.isArray(data)) {
                            result = data.reduce(function (sql, item) {
                                if (sql) {
                                    sql += ' OR ' + toSQL(item, field);
                                } else {
                                    sql = toSQL(item, field);
                                }
                                return sql;
                            }, '');
                        } else {
                            result = toSQL(data, field);
                        }

                        if (result && result.length > 0) {
                            return '(' + result + ')';
                        } else {
                            return '';
                        }
                    }
                }

                function generateValues(field) {
                    if (field.preValue) {
                        var datas;
                        if (angular.isArray(field.model)) {
                            datas = field.model.reduce(function (result, value) {
                                return result.concat(addon(value));
                            }, []);
                        } else {
                            datas = addon(field.model);
                        }
                        return datas;
                    } else {
                        return field.model;
                    }

                    function addon(value) {
                        return field.preValue.map(function (pre) {
                            return pre + value;
                        }).concat(value);
                    }
                }

                /**
                 * TODO:模糊匹配
                 * @param value
                 * @param field
                 * @param fieldName
                 * @returns {*}
                 */
                function valueToSQL(value, field, fieldName) {
                    if (field.directive === 'iuQueryRange') {
                        if (field.isRange) {
                            if (value.min !== value.max) {
                                return '{0}{1}{2} AND {0}{3}{4}'.format(field.fieldName, field.min.operator, value.min * (field.rate || 1), field.max.operator, value.max * (field.rate || 1));
                            }else{
                                return null;
                            }
                        } else {
                            return '{0}{1}{2}'.format(field.fieldName, field.operator, value * (field.rate || 1));
                        }
                    }
                    if (field.directive === 'iuQuerySelect') {
                        if (angular.isObject(value)) {
                            value = value.code;
                        }
                    }
                    if (value) {
                        if (field.operator === framework.sqlOperator.LIKE) {
                            return "{0} LIKE '{1}'".format(fieldName || field.fieldName, value);
                        } else if (field.fieldType === framework.datatype.int) {
                            return '{0}={1}'.format(fieldName || field.fieldName, value);
                        } else if (field.fieldType === framework.datatype.datetime) {
                            return "{0}>='{1}' AND {0}<'{2}'".format(fieldName || field.fieldName, value.begin.format('YYYY-MM-DD HH:mm:ss'), value.end.format('YYYY-MM-DD HH:mm:ss'));
                        } else if (field.fieldType === framework.datatype.ip) {
                            return ipv4ToSQL(value, field);
                        } else {
                            return "{0}='{1}'".format(fieldName || field.fieldName, value);
                        }
                    }
                }

                function toSQL(value, field) {
                    if (angular.isArray(field.fieldName)) {
                        var temp, result;
                        result = field.fieldName.reduce(function (sql, name) {
                            temp = valueToSQL(value, field, name);
                            if (temp) {
                                sql = sql ? (sql + ' OR ' + temp) : temp;
                            }
                            return sql;
                        }, '');
                        if (result) {
                            return '({0})'.format(result);
                        }
                    } else {
                        return valueToSQL(value, field);
                    }
                }

                function ipv4ToSQL(value, field) {
                    var sql, data;
                    if (framework.data.isIPv4(value)) {
                        data = cal(value, param.data.baseType.ipv4);
                        sql = '{0}={1}'.format(field.fieldName, data);
                    } else if (framework.data.isIPNumber(value)) {
                        sql = '{0}={1}'.format(field.fieldName, value);
                    } else if (framework.data.isIPv4WithMask(value)) {
                        var temp = value.split('/');
                        data = cal(temp[0], param.data.baseType.ipv4);
                        sql = '{0}={1}__{2}'.format(field.fieldName, data, temp[1]);
                    }
                    return sql;

                    function cal(data, type) {
                        var ip = 0;
                        data.split('.').forEach(function (item, index) {
                            ip += (parseInt(item) & 0xFF ) << 8 * (3 - index);
                        });

                        return type === framework.datatype.uint ? (ip >>> 0) : ip;
                    }
                }
            },
            /**
             *
             * @param which
             * @returns {*}
             */
            toArray: function (which) {
                if (which) {
                    if (angular.isArray(which)) {
                        return which;
                    } else {
                        return [which];
                    }
                }
            },
            /**
             * translating camelCase to snake-case
             * @param name
             */
            toSnake: function (name) {
                var regexp = /[A-Z]/g;
                var separator = '-';
                return name.replace(regexp, function (letter, pos) {
                    return (pos ? separator : '') + letter.toLowerCase();
                });
            },
            /**
             *
             * @param option
             * @returns {*}
             */
            extend: function (option) {
                option.name = option.fieldName + queryService.uniqueId();
                return option;
            },
            /**
             * get validator
             * @param field
             * @returns {*}
             */
            getValidator: function (field) {
                if (field.rules) {
                    return dataValidation;//[mutexValidation, dataValidation];
                } else if (field.directive === 'iuQueryRange') {
                    return rangeValidation;
                } else if (field.required) {
                    return [requiredValidation, dataValidation];
                } else {
                    return dataValidation;
                }
                function requiredValidation(value, view, field) {
                    if (hasNotValue(value)) {
                        return {result: false, message: localizeService.get('Query_Required').format(field.caption)};
                    }
                    return true;
                }

                function mutexValidation(value, view, field) {
                    //1.当前对象无值，其余对象也无值-失败
                    //2.当前对象有值，其余对象也有值-失败
                    var result, message;
                    if (hasNotValue(value)) {
                        result = field.$form.checkFieldRule(field, false);
                        message = '请输入值';
                    } else {
                        result = field.$form.checkFieldRule(field, true);
                        message = '条件值不允许同时存在！';
                    }

                    if (!result) {
                        return {result: false, message: message};
                    } else {
                        return true;
                    }
                }

                function dataValidation(model, value, field) {
                    var result = true;
                    if (model) {
                        if (angular.isArray(model)) {
                            for (var i = 0; i < model.length; i++) {
                                if (model[i] && !validateField(model[i], field)) {
                                    result = {
                                        result: false,
                                        message: localizeService.get('Query_InvalidData').format(model[i].toString())
                                    };
                                    break;
                                }
                            }
                        } else if (!validateField(model, field)) {
                            result = {
                                result: false,
                                message: localizeService.get('Query_InvalidData').format(model.toString())
                            };
                        }
                    }
                    return result;
                }

                function rangeValidation(model, value, field) {
                    if (field.isRange && model.min === model.max) {
                        var message;
                        if (model.min === 0) {
                            if (field.required) {
                                message = '请设置起始值';
                            } else {
                                return true;
                            }
                        } else {
                            message = '终始值不能相等';
                        }

                        return {
                            result: false,
                            message: message
                        };
                    }
                    return true;
                }

                function validateField(value, field) {
                    var result = true;
                    if (field.directive === 'iuQuerySelect') {
                        return result;
                    }
                    switch (field.fieldType) {
                        case framework.datatype.ip:
                            result = framework.data.isIPv4(value) || framework.data.isIPNumber(value) || framework.data.isIPv4WithMask(value);
                            break;
                        case framework.datatype.int:
                            result = Number.isInteger(value) || framework.data.isInt(value);
                            break;
                        case framework.datatype.double:
                            break;
                        case framework.datatype.datetime:
                            result = value && value.begin && value.end &&
                            value.begin.isValid() && value.end.isValid() &&
                            value.end.isAfter(value.begin);
                            break;
                        case framework.datatype.phone:
                            result = value && framework.data.isPhone(value);
                            break;
                        case framework.datatype.imsi:
                            result = value && framework.data.isIMSI(value);
                            break;
                        case framework.datatype.imei:
                            result = value && framework.data.isIMEI(value);
                            break;
                        default:
                            result = framework.hasValue(value) && value !== ',';
                            break;
                    }

                    if (angular.isDefined(field.pattern)) {
                        if (angular.isFunction(field.pattern)) {
                            result = field.pattern(value, result);
                        } else {
                            result = field.pattern.test(value);
                        }
                    }

                    return result;
                }

                function hasNotValue(value) {
                    if (typeof value === 'string') {
                        value = value.trim();
                    }
                    return typeof value === 'undefined' || value === '' || value === null || value !== value;
                }
            },
            /**
             * get default parser
             * @param field
             * @returns {Function}
             */
            parser: function (field) {
                var itemParser;
                if (field.fieldType === framework.datatype.datetime) {
                    itemParser = datetimeParser;
                } else if (field.fieldType === framework.datatype.pc383) {
                    itemParser = pc383Parser;
                }
                return function (viewValue) {
                    if (viewValue) {
                        if (field.allowMultiValue && viewValue.indexOf(',') > 0) {
                            var result = viewValue.split(',').where(function (item) {
                                return framework.hasValue(item) && item !== '';
                            }, function (item) {
                                return itemParser ? itemParser(item.trim()) : item;
                            });
                            if (viewValue.endsWith(',')) {
                                result.push(',');
                            }
                            return result;
                        } else if (itemParser) {
                            return itemParser(viewValue.trim());
                        } else {
                            return viewValue;
                        }
                    }
                    return viewValue;
                };

                function datetimeParser(viewValue) {
                    var splitChart = '-';
                    if (viewValue && viewValue.indexOf(splitChart) > 0) {
                        var item = viewValue.split(splitChart);
                        if (item.length === 2) {
                            return {
                                begin: moment(item[0].trim(), field.format),
                                end: moment(item[1].trim(), field.format)
                            };
                        }
                    }
                    return viewValue;
                }

                function pc383Parser(viewValue) {
                    return viewValue;
                    //return new window.query.pc383(viewValue, field.dataFormat || framework.dataFormat.pc383Decimal);
                    /*switch(field.dataFormat){
                     case framework.dataFormat.decimal:

                     break;
                     case framework.dataFormat.hex:
                     break;
                     case framework.dataFormat.pc383Decimal:
                     break;
                     case framework.dataFormat.pc383Hex:
                     break;
                     }*/
                }

                /*function ipParser(viewValue){

                 }*/
            },
            /**
             * get default formatter
             * @param field
             * @returns {Function}
             */
            formatter: function (field) {
                var itemFormatter,ellipsisCount = 3;
                if (field.fieldType === framework.datatype.datetime) {
                    itemFormatter = datetimeFormatter;
                } else if (field.directive === 'iuQuerySelect') {
                    itemFormatter = selectFormatter;
                } else if (field.directive === 'iuQueryRange') {
                    itemFormatter = rangeFormatter;
                }else if(field.directive === 'iuQueryIp'){

                }

                return function (modelValue) {
                    var temp,data;
                    if (angular.isArray(modelValue)) {
                        if (itemFormatter) {
                            if(field.ellipsis){
                                data = modelValue.slice(0,3);
                            }else{
                                data = modelValue;
                            }
                            temp = data.reduce(function (result, item) {
                                if (result) {
                                    result += ',' + itemFormatter(item);
                                } else {
                                    result = itemFormatter(item);
                                }
                                return result;
                            }, '');

                            if(field.ellipsis){
                                return temp + '...(共{0}项)'.format(modelValue.length);
                            }else{
                                return temp;
                            }

                        } else if(field.ellipsis && modelValue.length > ellipsisCount){
                            return modelValue.slice(0,3).join(',') + '...(共{0}项)'.format(modelValue.length);
                        } else {
                            return modelValue.join(',');
                        }
                    } else if (itemFormatter) {
                        return itemFormatter(modelValue);
                    } else {
                        return modelValue;
                    }
                };

                function datetimeFormatter(modelValue) {
                    if (modelValue) {
                        return modelValue.begin.format(field.format) + ' - ' + modelValue.end.format(field.format);
                    } else {
                        return '';
                    }
                }

                function selectFormatter(model) {
                    if (model) {
                        if (angular.isObject(model)) {
                            return '{0}[{1}]'.format(model.name, model.code);
                        } else {
                            return model;
                        }

                    }
                }

                function rangeFormatter(model) {
                    if (field.isRange) {
                        if (model.min !== model.max) {
                            return '{0}-{1}'.format(model.min, model.max);
                        }
                        //return '{0}{1} {2}{3}'.format((field.min.operator || '>='),model.min,(field.max.operator || '<'),model.max);
                    } else {
                        return '{0}{1}'.format(field.operator, model);
                    }
                }

                function ipFormatter(model){
                    return model;
                }
            },
            /**
             * get default result formatter
             * @param field
             */
            toResult: function (field) {
                return this.formatter(field);
            },
            /**
             * 静态数据接口
             * @param data
             * @returns {*}
             */
            data: function (data) {
                var key, result;
                if (data.dataSource && data.dataSource.length > 0) {
                    result = data.dataSource;
                } else if (!data.disableCache) {
                    key = generateKey(data);
                    result = getData(key);
                }

                if (result) {
                    return $q.when(result);
                } else {
                    return getFromServer(data, key);
                }

                function getFromServer(data, key) {
                    var param = {tablename: data.table, sql: generateSQL(data)};
                    return serviceUtil
                        .get('/StaticTableService/querySqlString', param, 'StaticTableService', true)
                        .then(function (response) {
                            var result = response.data.data;// parseData(response.data.data, data);
                            if (data.disableCache) {
                                cacheData(result, key);
                            }
                            return result;
                        }).catch(function (error) {
                            console.log(error);
                            return error;
                        });
                }

                function generateSQL(data) {
                    var gsql;
                    if (data.sql) {
                        return data.sql;
                    } else {
                        var sql;
                        for (var pro in data) {
                            if (data.hasOwnProperty(pro) && pro.endsWith('Field')) {
                                if (sql) {
                                    sql += ',' + data[pro];
                                } else {
                                    sql = data[pro];
                                }
                            }
                        }
                        gsql = 'SELECT {0} FROM {1}{2}{3}'.format(sql, data.table, data.where ? (' WHERE ' + data.where) : '', data.orderby ? (' ORDER BY ' + data.orderby) : '');
                        return gsql;
                    }
                    /*else if (data.parentField) {
                     return 'SELECT {0},{1},{2} FROM {3}{4}'.format(data.codeField, data.textField, data.parentField, data.table, data.where ? (' WHERE ' + data.where) : '');
                     }
                     else {
                     return 'SELECT {0},{1} FROM {2}{3}'.format(data.codeField, data.textField, data.table, data.where ? (' WHERE ' + data.where) : '');
                     }*/
                }

                function parseData(response, field) {
                    if (response && response.length > 0) {
                        return response.map(function (item) {
                            return {
                                code: item[field.codeField],
                                name: item[field.textField]
                            };
                        });
                    }
                }

                function generateKey(data) {
                    return (data.table || '') + (data.textField || '') + (data.codeField || '') + (data.where || '');
                }

                function getData(key) {
                    return cache[key];
                }

                function cacheData(data, key) {
                    // 是否允许缓存
                    /* if (!cache[key]) {
                     }*/
                }
            }
        };
    }])
/**
 * query config service
 * @author huk/2015.08.18
 */
    .factory('queryConfig', ['queryService', 'serviceUtil', function (queryService, serviceUtil) {
        'use strict';
        var toNumber = framework.toNumber;
        /**
         * convert fieldType from string
         * @param type
         * @returns {*}
         */
        function toDataType(type) {
            if (angular.isNumber(type)) {
                return type;
            } else if (angular.isString(type)) {
                var fieldType;
                switch (type) {
                    case 'double':
                    {
                        fieldType = framework.datatype.double;
                        break;
                    }
                    case 'float':
                    {
                        fieldType = framework.datatype.double;
                        break;
                    }
                    case 'int':
                    {
                        fieldType = framework.datatype.int;
                        break;
                    }
                    case 'unsignedInt':
                    {
                        fieldType = framework.datatype.uint;
                        break;
                    }
                    case 'short':
                    {
                        fieldType = framework.datatype.short;
                        break;
                    }
                    case 'long':
                    {
                        fieldType = framework.datatype.long;
                        break;
                    }
                    case 'datetime':
                    {
                        fieldType = framework.datatype.datetime;
                        break;
                    }
                    case 'ip':
                    {
                        fieldType = framework.datatype.ip;
                        break;
                    }
                    case 'ipv6':
                    {
                        fieldType = framework.datatype.ipv6;
                        break;
                    }
                    case 'pc':
                    {
                        fieldType = framework.datatype.pc;
                        break;
                    }
                    case 'pc383':
                    {
                        fieldType = framework.datatype.pc383;
                        break;
                    }
                    case 'pc888':
                    {
                        fieldType = framework.datatype.pc888;
                        break;
                    }
                    case 'pc77':
                    {
                        fieldType = framework.datatype.pc77;
                        break;
                    }
                    case 'phone':
                        fieldType = framework.datatype.phone;
                        break;
                    case 'imsi':
                        fieldType = framework.datatype.imsi;
                        break;
                    case 'imei':
                        fieldType = framework.datatype.imei;
                        break;
                    default :
                    {
                        fieldType = framework.datatype.string;
                        break;
                    }
                }
                return fieldType;
            }
            return framework.datatype.string;
        }

        return {
            gets: function (names) {
                var option, result = [];
                names.forEach(function (item) {
                    option = get(item);
                    if (option) {
                        result.push(option);
                    }
                });
                return result;

                function get(name) {
                    var option;
                    if (framework.queryOptions && framework.queryOptions[name]) {
                        option = {};
                        angular.extend(option, framework.queryOptions[name]);
                    }

                    if (option) {
                        return queryService.extend(option);
                    }
                }
            }
        };
    }])
/**
 * input query control
 * @author huk/2015.08.18
 */
    .directive('iuQueryInput', [function () {
        'use strict';
        return {
            restrict: 'EA',
            replace: true,
            //require:'ngModel',
            template: function (elem, attrs) {
                if (attrs.outer) {
                    return '<div class="option-item-outer-content"><input type=text class="form-control" name="{{::field.name}}" placeholder="{{::field.placeholder}}" data-ng-model="field.model" data-ng-model-options="{debounce:300}" data-iu-query-validation></div>';
                } else {
                    return '<div class="option-item-content"><input type=text name="{{::field.name}}" placeholder="{{::field.placeholder}}" data-ng-model="field.model" data-ng-model-options="{debounce:300}" data-iu-query-validation></div>';
                }
            }, scope: {
                field: '='
            },
            /*  controller: function ($scope) {
             },*/
            compile: function () {
                return {
                    post: function (scope, element, attrs) {
                        //scope.field.$ngModel = ctrl;
                    }
                };
            }
        };
    }])
/**
 * datetime query control
 * @author huk/2015.09.01
 * @description
 * 缺省值：
 * - 存在时间周期时，缺省起始值相差1个时间周期
 * - 按配置规则[beforeMonths、beforeDays、beforeHours、beforeMinutes]设置时间
 * - 存在时间周期时，before配置项必须不小于时间周期时才生效
 */
    .directive('iuQueryDatetime', [function () {
        'use strict';
        return {
            restrict: 'E',
            replace: true,
            require: '^iuQueryForm',
            template: function (elm, attrs) {
                var temp = '';
                if (attrs.outer) {
                    temp =
                        '<div class="input-group">' +
                        '    <span class="add-on input-group-addon">' +
                        '       <i class="glyphicon glyphicon-calendar fa fa-calendar"></i>' +
                        '    </span>' +
                        '    <input style="width: 265px" type="text" tooltip="{{::field.caption}}" " class="form-control active" name="{{::field.name}}" placeholder="{{::field.placeholder}}" data-ng-model="field.model" data-iu-query-validation>' +
                        '</div>';
                } else {
                    temp = '<div style="display:inline-block">' +
                    '<a class="option-outer-header-title">{{::field.caption}}</a>' +
                    '';
                }

                return temp;
            },
            scope: {
                field: '='
            },
            link: function (scope, element, attrs, ctrl) {
                var input = element.find('input'), datetimePicker;
                var daterangeOption = getOption();
                var isGranularity = framework.hasValue(scope.field.granularity);

                function getOption() {
                    return {
                        showDropdowns: true,
                        showWeekNumbers: true,
                        timePicker: true,
                        timePickerIncrement: 1,
                        timePicker12Hour: false,
                        timePickerSeconds: false,
                        opens: isGranularity ? 'left' : 'center',
                        buttonClasses: ['btn btn-default'],
                        applyClass: 'btn-small btn-primary',
                        cancelClass: 'btn-small',
                        format: scope.field.format || 'YYYY/MM/DD HH:mm:ss',
                        separator: ' - ',
                        locale: {
                            applyLabel: '确定',
                            cancelLabel: '清除',
                            fromLabel: '起',
                            toLabel: '止',
                            customRangeLabel: '自定义',
                            firstDay: 1
                        }
                    };
                }

                if (scope.field.granularity) {
                    scope.$watch('field.granularity', function (newvalue, oldvalue) {
                        if (newvalue !== oldvalue) {
                            updateGranularity(newvalue);
                        }
                    });
                }
                function updateGranularity(granularity) {
                    var option = getOption();
                    scope.field.model = null;
                    ctrl.update(scope.field);
                    var level = granularity ? (granularity.level || 'Second') : 'Second';
                    switch (level) {
                        case 'Minute':
                            scope.field.format = 'YYYY/MM/DD HH:mm';
                            if (datetimePicker) {
                                datetimePicker.setOptions(angular.extend(option, {
                                    timePicker: true,
                                    timePickerIncrement: scope.field.granularity.interval || 5,
                                    timePickerSeconds: false,
                                    format: scope.field.format
                                }), callback);
                            } else {
                                daterangeOption.timePicker = true;
                                daterangeOption.timePickerIncrement = scope.field.granularity.interval || 5;
                                daterangeOption.timePickerSeconds = false;
                                daterangeOption.format = scope.field.format;
                            }
                            break;
                        case 'Hour':
                            scope.field.format = 'YYYY/MM/DD HH:mm';
                            if (datetimePicker) {
                                datetimePicker.setOptions(angular.extend(option, {
                                    timePicker: true,
                                    timePickerIncrement: 60,
                                    timePickerSeconds: false,
                                    format: scope.field.format
                                }), callback);
                            } else {
                                daterangeOption.timePicker = true;
                                daterangeOption.timePickerIncrement = 60;
                                daterangeOption.timePickerSeconds = false;
                                daterangeOption.format = scope.field.format;
                            }
                            break;
                        case 'Second':
                            scope.field.format = 'YYYY/MM/DD HH:mm:ss';
                            if (datetimePicker) {
                                datetimePicker.setOptions(angular.extend(option, {
                                    timePicker: true,
                                    timePickerIncrement: 1,
                                    timePickerSeconds: true,
                                    format: scope.field.format
                                }), callback);
                            } else {
                                daterangeOption.timePicker = true;
                                daterangeOption.timePickerIncrement = 1;
                                daterangeOption.timePickerSeconds = true;
                                daterangeOption.format = scope.field.format;
                            }
                            break;
                        default:
                            scope.field.format = granularity.level === 'Day' ? 'YYYY/MM/DD' : 'YYYY/MM';
                            if (datetimePicker) {
                                datetimePicker.setOptions(angular.extend(option, {
                                    timePicker: false,
                                    format: scope.field.format
                                }), callback);
                            } else {
                                daterangeOption.timePicker = false;
                                daterangeOption.format = scope.field.format;
                            }
                            break;
                    }
                }

                /**
                 * initialize value by config
                 * @author huk/2015.09.07
                 */
                function initializeValue() {
                    var begin = moment(), end = moment();
                    setByGranularity();
                    setByConfig();
                    updateValueAndModel();

                    function setByGranularity() {
                        var level = scope.field.granularity ? (scope.field.granularity.level || 'Minute') : 'Minute';
                        switch (level) {
                            case 'Minute':
                                var interval = scope.field.granularity ? (scope.field.granularity.interval || 5) : 5;
                                var minute = getMinute(begin.minute(), interval);
                                begin.subtract(interval, 'm').minute(minute).seconds(0);
                                end.minute(minute).seconds(0);
                                break;
                            case 'Hour':
                                begin.subtract(1, 'h').minutes(0).seconds(0);
                                end.minutes(0).seconds(0);
                                break;
                            case 'Day':
                                begin.subtract(1, 'd').hours(0).minutes(0).seconds(0);
                                end.hours(0).minutes(0).seconds(0);
                                break;
                            case 'Month':
                                begin.subtract(1, 'M').days(1).hours(0).minutes(0).seconds(0);
                                end.days(1).hours(0).minutes(0).seconds(0);
                                break;
                        }
                    }

                    function setByConfig() {
                        if (scope.field.beforeMonths) {
                            //amount = scope.field.beforeMonths[0] + scope.field.beforeMonths[1];
                            begin = begin.add(scope.field.beforeMonths[0] + scope.field.beforeMonths[1], 'months');
                            end = end.add(scope.field.beforeMonths[1], 'months');
                        }
                        if (scope.field.beforeDays) {
                            begin = begin.add(scope.field.beforeDays[0] + scope.field.beforeDays[1], 'days');
                            end = end.add(scope.field.beforeDays[1], 'days');
                        }
                        if (scope.field.beforeHours) {
                            begin = begin.add(scope.field.beforeHours[0] + scope.field.beforeHours[1], 'hours');
                            end = end.add(scope.field.beforeHours[1], 'hours');
                        }
                        if (scope.field.beforeMinutes &&
                            (!scope.field.granularity || scope.field.granularity.level === 'Minute' || scope.field.granularity.level === 'Second')) {
                            begin = begin.add(scope.field.beforeMinutes[0] + scope.field.beforeMinutes[1], 'minutes');
                            end = end.add(scope.field.beforeMinutes[1], 'minutes');
                        }
                    }

                    function updateValueAndModel() {
                        if (datetimePicker) {
                            datetimePicker.setStartDate(begin);
                            datetimePicker.setEndDate(end);
                        } else {
                            daterangeOption.startDate = begin;
                            daterangeOption.endDate = end;
                        }

                        scope.field.model = {begin: begin, end: end};
                        ctrl.update(scope.field);
                    }

                    function getMinute(minute, interval) {
                        return minute - minute % interval;
                    }
                }

                function initialize() {
                    initializeStyle();
                    updateGranularity(scope.field.granularity);
                    initializeValue();

                    input.daterangepicker(daterangeOption, callback);
                    datetimePicker = input.data('daterangepicker');

                    function initializeStyle() {
                        if (!scope.field.granularity || scope.field.granularity.level === 'Second') {
                            input.css('font-size', '12px');
                        }
                    }
                }

                function callback(start, end) {
                    scope.$apply(function () {
                        scope.field.model = (start && end) ? {begin: start, end: end} : null;
                        ctrl.update(scope.field);
                    });
                }

                initialize();
            }
        };
    }])
/**
 * Select Control by uiSelect
 * @author huk/2015.09.22
 * @description
 *   选择项控件
 */
    .directive('iuQuerySelect', ['queryService', function (queryService) {
        'use strict';
        return {
            restrict: 'E',
            require: '^iuQueryForm',
            scope: {
                field: '='
            },
            template: function (elm, attrs) {
                var temp = '';
                //if (attrs.outer) {
                temp =
                    '<ui-select {0} data-ng-model="field.model" theme="select2" data-on-select="onSelected($item,$model)" ng-disabled="disable" class="iu-query-select-inner" name="{{::field.name}}" data-iu-query-validation>' +
                    '    <ui-select-match data-placeholder="{{::field.placeholder}}">{{$select.selected.name}}</ui-select-match>' +
                    '    <ui-select-choices data-repeat="item in datas | filter: $select.search">' +
                    '        <span ng-bind-html="item.name | highlight: $select.search"></span>' +
                    '    </ui-select-choices>' +
                    '</ui-select><i ng-if="disable" class="fa fa-refresh fa-spin" style="margin-left: 3px"></i>';
                //}

                return temp.format(attrs.allowmultivalue === 'true' ? "multiple tagging tagging-label=\"(custom 'new' label)\"" : '');
            },
            link: function (scope, element, attrs, ctrl) {
                loadStatue(true);
                var deferred = queryService.data(scope.field.data)
                    .then(function (result) {
                        if (result && result.length) {
                            scope.datas =  result.map(function (item) {
                                return {
                                    code: item[scope.field.data.codeField],
                                    name: item[scope.field.data.textField]
                                };
                            });
                        }
                    });
                deferred['finally'](function () {
                    loadStatue(false);
                });

                function loadStatue(statue) {
                    scope.disable = statue;
                }

                scope.onSelected = function ($item, $model) {
                    ctrl.update();
                };

                /* scope.datas =
                 [{name: 'abc', code: 1}, {name: '123', code: 2}, {name: 'ert', code: 3},
                 {name: 'sdf', code: 3}, {name: 'zxc', code: 2}, {name: 'abc', code: 1}, {
                 name: '123',
                 code: 2
                 }, {name: 'ert', code: 3},
                 {name: 'sdf', code: 3}, {name: 'zxc', code: 2}];*/
            }
        };
    }])
/**
 * Range Control
 * @author huk/2015.09.28
 * @description
 * @paramter
 * @todo 添加输入框允许手动输入、允许控制是否显示图形
 */
    .directive('iuQueryRange', ['$rootScope', function ($rootScope) {
        'use strict';
        return {
            restrict: 'E',
            require: '^iuQueryForm',
            scope: {
                field: '='
            },
            template: '<input type="hidden" class="slider-input"  value="0" name="{{::field.name}}" data-ng-model="field.model" data-iu-query-validation />',
            link: function (scope, element, attrs, ctrl) {
                var format = '%s', field = scope.field;
                checkParamter();
                var paramter = {
                    from: field.range[0],
                    to: field.range[1],
                    step: 1,
                    format: format,
                    width: 300,
                    theme: 'theme-blue',
                    showLabels: true,
                    isRange: field.isRange,
                    onstatechange: function (e) {
                        var values;
                        if (field.isRange) {
                            values = e.split(',');
                            scope.field.model = {
                                min: framework.toNumber(values[0]),
                                max: framework.toNumber(values[1])
                            };
                        } else {
                            scope.field.model = framework.toNumber(e);
                        }

                        ctrl.update();
                        if (!scope.$$phase && !$rootScope.$$phase) {
                            scope.$apply();
                        }
                    }
                };
                if (field.scale) {
                    paramter.scale = field.scale;
                }
                $('.slider-input', element).jRange(paramter);

                function checkParamter() {
                    field.step = field.step || 1;
                    field.isRange = angular.isDefined(scope.field.isRange) || true;
                    field.range = field.range || [0, 100];
                    field.step = field.step || 1;
                    if (field.isRange) {
                        field.min = field.min || {
                            operator: '>=',
                            value: 0
                        };
                        field.min.operator = field.min.operator || '>=';
                        field.min.value = field.min.value || 0;

                        field.max = field.max || {
                            operator: '<',
                            value: 0
                        };
                        field.max.operator = field.max.operator || '<';
                        field.max.value = field.max.value || 0;
                    } else {
                        field.value = field.value || 0;
                        field.operator = field.operator || '>=';
                    }

                    if (field.unit) {
                        format = '%s ' + field.unit;
                    }
                    field.$onRested = function () {
                        console.log('removed');
                    };
                }
            }
        };
    }])
/**
 *
 */
    .factory('localizeService',function(){
        return {
            get:function(key){
                switch(key){
                    case 'Query_Clear':
                        return 'Remove';
                        break;
                    case 'Query_Header_Title':
                        return 'Query Option';
                        break;
                    case 'Query_InvalidData':
                        return 'Invalid data:{0}';
                        break;
                    case 'Query_Required':
                        return 'Require:{0}';
                        break;
                    case 'Query_Result_Title':
                        return 'Option Values:';
                        break;
                }
            }
        }
    })
/**
 * HTTP Request Service
 * @author huk 2014/12/9
 */
    .factory('serviceUtil', ['$http', function ($http) {
        'use strict';
        var apiurl = window.config.uri.http,
            urls = window.config.uri.webs || false;
        return {
            /**
             * 构建http请求服务地址
             * @description 根据config配置中apiurl生成。
             * 当请求中包含service参数并且config.urls中已配置相应URL时，按urls中的配置处理。
             * @param url 地址
             * @param service 服务类别
             * @returns {string}
             */
            buildUrl: function (url, service) {
                if (service && urls && urls[service]) {
                    return urls[service] + url;
                } else {
                    return apiurl + url;
                }
            },

            /**
             * 通用http get方法
             * @param url 服务地址
             * @param data 请求数据
             * @param service 服务关键字
             * @param ignore 是否忽略loadingbar
             * @returns {HttpPromise}
             */
            get: function (url, data, service, ignore) {
                return $http.get(this.buildUrl(url, service), {
                    params: data,
                    ignoreLoading: ignore || false
                });
            },

            /**
             * 通用http post方法
             * @param url 服务地址
             * @param data 请求数据
             * @param service 服务关键字
             * @param config 配置参数
             * @returns {HttpPromise}
             */
            post: function (url, data, service, config) {
                if (config) {
                    return $http.post(this.buildUrl(url, service), data, config);
                } else {
                    return $http.post(this.buildUrl(url, service), data);
                }
            }

        };
    }]);
