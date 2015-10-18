/**
 * 通用定义.
 * @author Huk/2014.10.07
 */
if (typeof window.framework === 'undefined') {
  window.framework = {};
}
(function (framework) {
  'use strict';
  /*********************************************************/
  /**
   * 数据类型枚举
   * @type {{string: number, int: number, double: number, uInt: number, pc383: number, pc77: number, pc888: number, ip: number, ipv6: number, date: number, hex: number}}
   * @author Huk/2014.11.24
   * @final
   */
  framework.datatype = {
    string: 0,
    int: 1,
    double: 2,
    uint: 3,
    pc383: 4,
    pc77: 5,
    pc888: 6,
    ip: 7,
    ipv6: 8,
    datetime: 9,
    hex: 10,
    short: 11,
    long: 12,
    pc: 13,
    phone: 14,
    imsi: 15,
    imei: 16
  };
  framework.dataFormat = {
    decimal: 0,
    hex: 1,
    pc383Decimal: 2,
    pc383Hex: 3,
    pc77Decimal: 4,
    pc77Hex: 5,
    pc888Decimal: 6,
    pc888Hex: 7,
    ipV4: 8,
    ipV6: 9,
    string: 10,
    dateTime: 11,
    percent: 12
  };
  framework.sqlOperator = {
    In: 0,
    BETWEEN: 1,
    LIKE: 2,
    IsNUll: 3,
    COMPAR: 4,
    EXISTS: 5,
    REGEXP: 6
  };
  framework.data = {
    /**
     * 判断是否int数据类型
     * @param value
     * @returns {boolean}
     */
    /* isint: function (value) {
     return !isNaN(value);
     },*/
    /**
     * 无效值定义
     */
    invalid: {
      int: [4294967295],
      ip: [0],
      byte: [255],
      short: [65535],
      pc: [0],
      value: '-'
    },
    /**
     * 数据校验正则表达式
     */
    //TODO:转换为parame.js
    REGS: {
      ipv4: /^(?!^255.255.255.255$)(?!^0{1,3}(\.0{1,3}){3}$)((25[0-5]|2[0-4]\d|[01]?\d\d?)($|(?!\.$)\.)){4}$/,
      ipv4number: /^-?([1-9]|[1-9]\d+)$/,
      ipv4Mask: /^([1-9]|[1-2]\d|3[0-2])$/,
      ipv4WithMask: /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\/[1-9]|[1-2]\d|3[0-2]$/,
      ipv6s: /^([\da-f]{1,4}(:|::)){1,6}[\da-f]{1,4}$/i,
      ipv6l: /^([\da-f]{1,4}:){7}[\da-f]{1,4}$/i,
      pc383: /^[0-7]\-((1\d\d)|(2[0-5][0-5])|[0-9a-fA-F]{1,2})\-[0-7]$/,
      pc383d: /^[0-7]\-((1\d\d)|(2[0-5][0-5])|\d{1,2})\-[0-7]$/,
      pc383h: /^[0-7]\-[0-9a-fA-F]{1,2}\-[0-7]$/,
      pc77: /^([0-9]|[a-f]){2}\-([0-9]|[a-f]){2}$/,
      pc888: /^([0-9]|[a-f]|[A-F]){2}\-([0-9]|[a-f]|[A-F]){2}\-([0-9]|[a-f]|[A-F]){2}$/,
      pc888d: /^([0-9]){2}\-([0-9]){2}\-([0-9]){2}$/,
      pc888h: /^([0-9]|[a-f]|[A-F]){2}\-([0-9]|[a-f]|[A-F]){2}\-([0-9]|[a-f]|[A-F]){2}$/,
      phone: /((\d{11})|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$)/, //支持手机号码，3-4位区号，7-8位直播号码，1－4位分机号“-”
      mobilePhone: /^[1]+\d{10}/,
      int: /^-?\d+$/,
      hex: /^-?(\d|[a-f]|[A-F])+$/,
      imsi: /^\d{15}$/,
      imei: /^\d{14,15}$/
    },
    /**********************************************************************/
    /*int相关方法*/
    /**
     * 10进制转换为16进制（不显示0x）
     * 注：value.toString(2/8/10/16)仅对number类型有限
     *        parseInt(value,2/8/10/16)对string,number均有效，2/8/10/16表示value的当前进制，结果值均转换为10进制
     *                     "0x"开始-16进制;"0"开始-8进制；其余为10进制
     * @param value 数值类型或十进制字符串
     * @returns {string} string类型的16进制数值
     */
    decimalToHex: function (value) {
      if (typeof value === 'number') {
        return value.toString(16);
      } else {
        var temp = this.toInt(value);
        if (isNaN(temp)) {
          return '';
        } else {
          return temp.toString(16);
        }
      }
    },
    /**
     *16进制转换为10进制
     * @param value
     * @returns {Number|*} - number类型的10进制数值
     */
    hexToDecimal: function (value) {
      return parseInt(value, 16);
    },
    /**
     * 转换为10进制int数值
     * @param value
     * @param base 数据的进制格式
     * @returns {Number|*}
     */
    toInt: function (value, base) {
      if (base) {
        return parseInt(value, base);
      } else {
        return parseInt(value);
      }
    },
    /**
     * 转为浮点数
     * @param value
     * @returns {Number}
     */
    toDouble: function (value) {
      return parseFloat(value);
    },
    /***
     * 有符号整数转为无符号整数:-1>4294967295
     * JavaScript的所有位操作都是先将操作对象转化为32位有符号数进行的
     * 推荐使用 >>> 因为最左边一位会被解析成符号位，当数字溢出时，会被解析成负数
     * @param value - int数值
     * @returns {Number}
     */
    intToUint: function (value) {
      return value >>> 0;
    },
    /**
     * 4294967295>-1
     * @param value
     * @returns {*}
     */
    uintToInt: function (value) {
      return value << 0;
    },
    /**********************************************************************/
    /*IPv4相关方法*/
    /**
     * ipv4点码格式转换为十进制数值
     * @param ip
     * @returns {number}
     */
    ipv4ToInt: function (ip) {
      var num = 0;
      ip = ip.split('.');
      num = Number(ip[0]) << 24 + Number(ip[1]) << 16 + Number(ip[2]) << 8 + Number(ip[3]);
      //num = num >>> 0;
      return num;
    },
    /**
     *
     * @param ip
     * @returns {number}
     */
    ipv4ToUint: function (ip) {
      var num = this.ipv4ToInt(ip);
      num = num >>> 0;
      return num;
    },
    /**
     * 十进制数值转IP地址
     * @param num
     * @returns {string}
     */
    intToIP: function (num) {
      var str, tt = [];
      tt[0] = (num >>> 24) >>> 0;
      tt[1] = ((num << 8) >>> 24) >>> 0;
      tt[2] = (num << 16) >>> 24;
      tt[3] = (num << 24) >>> 24;
      str = String(tt[0]) + "." + String(tt[1]) + "." + String(tt[2]) + "." + String(tt[3]);
      return str;
    },
    /**
     * 判断掩码格式有效性
     * @param mask
     * @returns {boolean}
     */
    isMask: function (mask) {
      var reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])(\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])){3}$/;
      if (reg.test(mask) === false) {
        return false;
      }
      var i = 0, a = -1, tt = this.ip2Num(mask), str = tt.toString(2);
      for (i = 0; i < str.length; i++) {
        if (str.charAt(i) === "0") {
          a = i;
        }
        if (str.charAt(i) === "1" && a > -1) {
          return false;
        }
      }
      return true;
    },

    /**
     * 判断是否IPv4类型
     * 标准格式的IP地址
     * @param value
     */
    isIPv4: function (value) {
      /*var flag = ip.match(this.REGS.ipv4);
       if (flag !== undefined && flag !== '') {
       return true;
       } else {
       return false;
       }*/
      return this.REGS.ipv4.test(value);
    },
    /**
     * 数值格式的IP地址，允许有符号和无符号整数
     * @param value
     * @returns {boolean}
     */
    isIPNumber: function(value){
      return this.REGS.ipv4number.test(value);
    },
    /**
     * 掩码：1-32
     * @param value
     */
    isIPv4Mask: function(value){
      return this.REGS.ipv4Mask.test(value);
    },
    /**
     * 带掩码格式的IP地址，如：192.168.2.1/24
     * @param value
     * @returns {boolean}
     */
    isIPv4WithMask: function (value) {
      if(value && value.indexOf('/') > 0){
        var data = value.split('/');
        return this.REGS.ipv4.test(data[0]) && this.REGS.ipv4Mask.test(data[1]);
      }
      return false;
    },
    isInt: function (value) {
      return this.REGS.int.test(value);
    },
    isHex: function(value){
      return this.REGS.hex.test(value);
    },
    /**
     * 判断是否IPv6类型
     * @param value
     * @returns {boolean}
     */
    isipv6: function (value) {
      var isIpv6 = false;
      if (value.match(/:/g).length <= 7 && /::/.test(value) ? this.REGS.ipv6s.test(value) : this.REGS.ipv6l.test(value)) {
        isIpv6 = true;
      }

      return isIpv6;
    },
    isPhone: function (value) {
      return this.REGS.phone.test(value);
    },
    isIMSI: function (value) {
      return this.REGS.imsi.test(value);
    },
    isIMEI: function(value){
      return this.REGS.imei.test(value);
    },
    /*********************************************************************/
    /*IPv6方法*/

    /*********************************************************************/
    /*pc383*/
    /**
     * 无符号转PC383
     * @param value
     * @param isHex - PC383是否为16进制格式
     * @returns {string}
     */
    uintToPc383: function (value, isHex) {
      var i3 = (value >> 11) & 0x7,
          i8 = (value >> 3) & 0xff,
          i32 = value & 0x7;
      if (isHex) {
        return this.decimalToHex(i3) + '-' + this.decimalToHex(i8) + '-' + this.decimalToHex(i32);
      } else {
        return i3 + '-' + i8 + '-' + i32;
      }
    },

    /**
     * PC383转十进制数值
     * @param value
     * @param isHex PC383是否16进制格式
     */
    pc383ToInt: function (value, isHex) {
      var temp = this.value.splice('-');
      var i3 = this.toInt(temp[0], isHex ? 16 : 10);
      var i8 = this.toInt(temp[1], isHex ? 16 : 10);
      var i32 = this.toint(temp[2], isHex ? 16 : 10);
      return i32 * 0x800 + i8 * 8 + i32;
    },

    /**
     *PC383转十六进制
     * @param value
     * @param isHex
     * @returns {string}
     */
    pc383ToHex: function (value, isHex) {
      var temp = this.pc383ToInt(value, isHex);
      return this.decimalToHex(temp);
    },

    /**
     * 是否PC383（十进制格式或十六进制）
     * @param value
     */
    isPc383: function (value) {
      return value && this.REGS.pc383.test(value);
    },
    /**
     * 是否PC383十进制格式
     * @param value
     */
    isPc383Decimal: function (value) {
      return value && this.REGS.pc383d.test(value);
    },
    /**
     * 是否PC383十六进制格式
     * @param value
     */
    isPc383Hex: function (value) {
      return value && this.REGS.pc383h.test(value);
    },
    /**********************************************************************/
    /**
     *是否PC77数据类型
     * @param value
     * @returns {boolean}
     */
    isPc77: function (value) {
      return value && this.REGS.pc77.test(value);
    },
    /**
     * uint转PC77数据类型
     * @param value
     * @returns {string}
     */
    uintToPc77: function (value) {
      return ((value >> 7) & 0x7f) + '-' + (value & 0x7f);
    },
    /**
     * PC77转十进制数据类型
     * @param value
     */
    pc77ToInt: function (value) {
      var temp = value.split('-');
      return this.toInt(temp[0], 16) + this.toInt(temp[1], 16) * 0x80;
    },
    /**
     * PC77转十六进制类型
     * @param value
     * @returns {string}
     */
    pc77ToHex: function (value) {
      var temp = this.pc77ToInt(value);
      return this.decimalToHex(temp);
    },
    /**********************************************************************/
    /**
     * 是否PC888数值
     * @param value
     * @returns {*|boolean}
     */
    isPc888: function (value) {
      return value && this.REGS.pc888.test(value);
    },
    /**
     * 十进制无符号值转PC888
     * @param value
     * @param isHex pc888是否十六进制格式
     */
    uintToPc888: function (value, isHex) {
      var i81 = (value >> 16) & 0xff,
          i82 = (value >> 8) & 0xff,
          i83 = value & 0xff;

      if (isHex) {
        return this.decimalToHex(i81) + '-' + this.decimalToHex(i82) + '-' + this.decimalToHex(i83);
      } else {
        return i81 + '-' + i82 + '-' + i83;
      }
    },
    /**
     *十六进制值转PC888
     * @param value
     * @param isHex pc888是否十六进制格式
     */
    hexToPc888: function (value, isHex) {
      var d = this.hexToDecimal(value);
      return this.uintToPc383(d, isHex);
    },
    /**
     *PC888转十进制数值
     * @param value
     * @param isHex pc888是否十六进制格式
     */
    pc888ToInt: function (value, isHex) {
      var temp = value.splice('-'), d = isHex ? 16 : 10;
      return this.toInt(temp[0], d) * 256 * 256 + this.toInt(temp[1], d) * 256 + this.toInt(temp[2], d);
    },
    /**
     * PC
     * @param value
     * @param isHex
     * @returns {string}
     */
    pc888ToHex: function (value, isHex) {
      var temp = this.pc888ToInt(value, isHex);
      return this.decimalToHex(temp);
    },

    /**********************************************************************/
    /*pc*/
    /**
     * 是否PC888数值
     * @param {number} value 数值
     * @returns {boolean}
     */
    is24PC: function (value) {
      return value && (value & 0xff0000) > 0;
    },

    /**
     * 十进制数据源转换
     * @param value 十进制数值
     * @param {framework.dataFormat} to 目标显示格式
     * @returns {*}
     */
    fromDecimal: function (value, to) {
      var temp;
      switch (to) {
        case framework.dataFormat.hex:
        {
          temp = this.decimalToHex(value);
          break;
        }
        case framework.dataFormat.ipV4:
        {
          temp = this.intToIP(value);
          break;
        }
        case framework.dataFormat.pc383Decimal:
        {
          temp = this.uintToPc383(value, false);
          break;
        }
        case framework.dataFormat.pc383Hex:
        {
          temp = this.uintToPc383(value, true);
          break;
        }
        case framework.dataFormat.pc77Decimal:
        {
          temp = this.uintToPc77(value);
          break;
        }
        case framework.dataFormat.pc77Hex:
        {
          temp = this.uintToPc77(value);
          break;
        }
        case framework.dataFormat.pc888Decimal:
        {
          temp = this.uintToPc888(value, false);
          break;
        }
        case framework.dataFormat.pc888Hex:
        {
          temp = this.uintToPc888(value, false);
          break;
        }
        default:
        {
          temp = value;
          break;
        }
      }

      return temp;
    },

    /**
     *
     * @param value
     * @param {framework.datatype} from
     * @param {framework.dataFormat} to
     */
    fromIP: function (value, from, to) {
      var temp = from && from === framework.datatype.int ?
          this.ipv4ToInt(value) : this.ipv4ToUint(value);

      return temp;
    },
    /**
     * 通用数据转换
     * @param value 数值
     * @param from 原数据格式
     * @param to 目标数据格式
     */
    fromto: function (value, from, to) {
      switch (from) {
        case framework.dataFormat.decimal:
          return this.fromDecimal(value, from, to);
        case framework.dataFormat.hex:
          return this.fromHex(value, from, to);
        case framework.dataFormat.ipV4:
          return this.fromIP(value);
        default:
          return value;
      }
    }
  };

  framework.queryOptions = {
    datetime: {
      fieldName: 'starttime',
      required: true,
      fieldType: framework.datatype.datetime,
      allowMultiValue: true,
      caption: '开始时间',
      placeholder: '请输入时间',
      directive: 'iuQueryDatetime',
      beforeMonths: [0, 0],
      beforeDays: [0, 0],
      beforeHours: [-1, 0],
      beforeMinutes: [0, 0],
      CurTimeType: 'Hour'
    },
    ip: {
      fieldName: 'ip2',
      value:  ['192.168.2.89/32'],
      fieldType: framework.datatype.ip,
      allowMultiValue: true,
      caption: 'IP Address',
      help: "<div><ol><li>支持标准IP格式,如'192.168.2.18'</li><li>支持1-32位掩码,如'192.168.2.18/24'，缺省32位掩码</li><li>支持IP转换后的数值模式，如34736137</li><li>多个值之间以','分隔</li></ol></div>",
      placeholder: '输入IP格式数据或转换后的数值，如192.168.2.18或34736137',
      directive: 'iuQueryInput'
    },
    imsi: {
      fieldName: 'IMSI',
      fieldType: framework.datatype.imsi,
      allowMultiValue: true,
      caption: 'IMSI',
      placeholder: 'Please input IMSI',
      //required: true,
      directive: 'iuQueryInput'
    },
    calling: {
      caption: 'Calling',
      fieldName: 'calling',
      fieldType: framework.datatype.phone,
      preValue: ['+86', '86', '+'],
      directive: 'iuQueryInput'
    },
    service: {
      caption: 'Service',
      required: true,
      fieldName: 'service_group',
      fieldType: framework.datatype.int,
      //allowMultiValue:true,
      directive: 'iuQuerySelect',
      data: {
        table: 'ZcProbeFront',
        codeField: 'FrontNo',
        textField: 'FrontName'
        //source
      }
    },
    iuRange: {
      caption: 'Value Range',
      fieldName: 'range',
      fieldType: framework.datatype.int,
      unit: '秒',
      rate: 1,
      setp: 1,
      isRange: true,
      range: [0, 100],
      min: {
        operator: '>=',
        value: 5
      },
      max: {
        operator: '<',
        value: 10
      },
      directive: 'iuQueryRange'
    }
  };


  window.onerror = function (msg) {
    console.log('[ERROR]:' + msg);
    return true;
  };
  if (!Array.prototype.first) {
    /**
     * 查找符合匹配条件的第一个元素
     * @author huk/2015.03.12
     * @param callback
     * @returns {*}
     */
    Array.prototype.first = function (callback) {
      for (var i = 0, count = this.length; i < count; ++i) {
        if (callback(this[i])) {
          return this[i];
        }
      }
    };
  }

  if (!Array.prototype.where) {
    /**
     * 查找符合匹配条件的元素并返回值函数处理后的结果值
     * @author huk/2015.03.12
     * @param filter
     * @param value
     */
    Array.prototype.where = function (filter, value) {
      var result = [];
      for (var i = 0, count = this.length; i < count; ++i) {
        if (filter(this[i])) {
          result.push(value(this[i]));
        }
      }
      return result;
    };
  }
  if (!String.prototype.format) {
    /**
     * format
     * @author huk/2015.05.05
     * @returns {string}
     */
    String.prototype.format = function () {
      var args = arguments;
      return this.replace(/\{\d+\}/g, function (m) {
        return args[m.substring(1, m.length - 1)];
      });
    };
  }
})(window.framework);
/**
 * dropdownpanel
 * @author huk/2015.03.01
 * @description
 * base bootstrap dropdown
 * set 'data-close' to control if it's auto close or not.
 * @example
 * <div class="dropdown">
 *     <div class="dropdown-toggle selecter text-info" data-toggle="dropdownpanel" data-autoclose="false">
 *         ...
 *      </div
 *      <div class="dropdown-menu">
 *          ...
 *      </div>
 *  </div>
 */
(function ($) {
  'use strict';
  var backdrop = '.dropdownpanel-backdrop';
  var toggle = '[data-toggle="dropdownpanel"]';
  var DropdownPanel = function (element) {
    $(element).on('click.iu.dropdownpanel', this.toggle);
  };

  DropdownPanel.VERSION = '1.0.0';

  DropdownPanel.prototype.toggle = function (e) {
    var $this = $(this);

    if ($this.is('.disabled, :disabled'))
      return;

    var $parent = getParent($this);
    var isActive = $parent.hasClass('open');
    var isSelf;
    if (isActive && isSelf)
      return false;

    if (!isActive) {
      clearMenus();
      if ('ontouchstart' in document.documentElement && !$parent.closest('.navbar-nav').length) {
        $('<div class="dropdownpanel-backdrop"/>').insertAfter($(this)).on('click', clearMenus);
      }

      var relatedTarget = {relatedTarget: this};
      $parent.trigger(e = $.Event('show.iu.dropdownpanel', relatedTarget));
      if (e.isDefaultPrevented()){
        return;
      }

      $this.trigger('focus');
      $parent
          .toggleClass('open')
          .trigger('shown.iu.dropdownpanel', relatedTarget);
    }

    return false;
  };

  DropdownPanel.prototype.close = function (e) {
  };

  DropdownPanel.prototype.keydown = function (e) {
    if (!/(38|40|27)/.test(e.keyCode))
      return;

    var $this = $(this);
    e.preventDefault();
    e.stopPropagation();

    if ($this.is('.disabled, :disabled'))
      return;

    var $parent = getParent($this);
    var isActive = $parent.hasClass('open');
    if (!isActive || (isActive && e.keyCode == 27)) {
      if (e.which == 27) {
        $parent.find(toggle).trigger('focus');
      }
      return $this.trigger('click');
    }

    var desc = ' li:not(.divider):visible a';
    var $items = $parent.find('[role="menu"]' + desc + ', [role="listbox"]' + desc);
    if (!$items.length)
      return;

    var index = $items.index($items.filter(':focus'));
    if (e.keyCode === 38 && index > 0)
      index--;
    if (e.keyCode === 40 && index < $items.length - 1)
      index++;
    if (!~index)
      index = 0;

    $items.eq(index).trigger('focus');
  };

  function clearMenus(e) {
    if (e && e.which === 3)
      return;
    $(backdrop).remove();
    $(toggle).each(function () {
      var $current = $(this);
      var autoClose = $current.data('autoclose');
      if (autoClose === 'false' || autoClose === false) {
        return;
      }
      var $parent = getParent($(this));
      var relatedTarget = {relatedTarget: this};
      if (!$parent.hasClass('open'))
        return;

      if (e.isDefaultPrevented())
        return;

      var target = $(e.target);
      var cls = target.closest($current).length;
      var clsp = target.closest($parent).length;
      if (e.type == "focusin" || target.closest($current).length || target.closest($parent).length) {
        return;
      }
      $parent.removeClass('open');
    });
  }

  function getParent($this) {
    var selector = $this.attr('data-target');

    if (!selector) {
      selector = $this.attr('href');
      selector = selector && /#[A-Za-z]/.test(selector) && selector.replace(/.*(?=#[^\s]*$)/, '');
    }

    var $parent = selector && $(selector)
    return $parent && $parent.length ? $parent : $this.parent();
  }

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this);
      var data = $this.data('iu.dropdownpanel');

      if (!data)
        $this.data('iu.dropdownpanel', (data = new DropdownPanel(this)));
      if (typeof option == 'string')
        data[option].call($this);
    });
  }

  var old = $.fn.dropdownpanel;
  $.fn.dropdownpanel = Plugin;
  $.fn.dropdownpanel.Constructor = DropdownPanel;
  $.fn.dropdownpanel.noConflict = function () {
    $.fn.dropdownpanel = old;
    return this;
  };

  $(document)
      .on('mousedown.iu.dropdownpanel.data-api', clearMenus)
      .on('click.iu.dropdownpanel.data-api', toggle, DropdownPanel.prototype.toggle)
      .on('keydown.iu.dropdownpanel.data-api', toggle + ', [role="menu"], [role="listbox"]', DropdownPanel.prototype.keydown);
})(jQuery);
