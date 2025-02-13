//
// Autogenerated by Thrift Compiler (0.12.0)
//
// DO NOT EDIT UNLESS YOU ARE SURE THAT YOU KNOW WHAT YOU ARE DOING
//

var thrift = require('thrift');
var Thrift = thrift.Thrift;
var Q = thrift.Q;


var ttypes = module.exports = {};
ttypes.EventCategory = {
  'IGNITION' : 100,
  'TOPOLOGY' : 200,
  'UPGRADE' : 300,
  'SCAN' : 400,
  'CONFIG' : 500,
  'TRAFFIC' : 600,
  'STATUS' : 700,
  'DRIVER' : 800,
  'SCHEDULER' : 900,
  'OPENR' : 1000,
  'WATCHDOG' : 1100,
  'SYSTEM' : 1200,
  'FIRMWARE' : 1300,
  'ZMQ' : 1400,
  'LOGTAIL' : 1500,
  'HIGH_AVAILABILITY' : 1600
};
ttypes.EventId = {
  'SET_LINK_STATUS' : 101,
  'MINION_SET_LINK_STATUS' : 102,
  'DRIVER_LINK_STATUS' : 103,
  'TOPOLOGY_NAME_MODIFIED' : 201,
  'TOPOLOGY_NODE_ADDED' : 202,
  'TOPOLOGY_NODE_MODIFIED' : 203,
  'TOPOLOGY_NODE_REMOVED' : 204,
  'TOPOLOGY_LINK_ADDED' : 205,
  'TOPOLOGY_LINK_MODIFIED' : 206,
  'TOPOLOGY_LINK_REMOVED' : 207,
  'TOPOLOGY_SITE_ADDED' : 208,
  'TOPOLOGY_SITE_MODIFIED' : 209,
  'TOPOLOGY_SITE_REMOVED' : 210,
  'UPGRADE_PREPARE' : 301,
  'UPGRADE_COMMIT' : 302,
  'UPGRADE_INFO' : 303,
  'UPGRADE_IMAGE_INFO' : 304,
  'SCAN_REQ' : 401,
  'SCAN_RESP' : 402,
  'SCAN_COMPLETE' : 403,
  'CONFIG_MODIFIED' : 501,
  'SET_CONFIG' : 502,
  'MINION_SET_CONFIG' : 503,
  'CONFIG_POLARITY_INFO' : 504,
  'CONFIG_GOLAY_INFO' : 505,
  'CONFIG_CONTROL_SUPERFRAME_INFO' : 506,
  'IPERF_INFO' : 601,
  'PING_INFO' : 602,
  'NODE_STATUS' : 701,
  'LINK_STATUS' : 702,
  'GPS_SYNC' : 703,
  'NODE_INFO' : 704,
  'UNKNOWN_NODE' : 705,
  'REBOOT_NODE_REQ' : 706,
  'RESTART_MINION_REQ' : 707,
  'WIRED_LINK_STATUS' : 708,
  'DRIVER_NODE_INIT' : 801,
  'DRIVER_DEVICE_STATUS' : 802,
  'OPENR_KVSTORE_MODIFIED' : 1001,
  'OPENR_LINK_MONITOR_MODIFIED' : 1002,
  'WDOG_REPAIR_FW_RESTART' : 1101,
  'WDOG_REPAIR_NO_FW_RESTART' : 1102,
  'WDOG_REBOOT' : 1103,
  'LOG_BASED_EVENT' : 1501,
  'HIGH_AVAILABILITY_STATE_CHANGE' : 1601,
  'PEER_VERSION_MISMATCH' : 1602
};
ttypes.EventLevel = {
  'INFO' : 10,
  'WARNING' : 20,
  'ERROR' : 30,
  'FATAL' : 40
};
var Event = module.exports.Event = function(args) {
  this.source = null;
  this.timestamp = null;
  this.reason = null;
  this.details = null;
  this.category = null;
  this.level = null;
  this.entity = null;
  this.nodeId = null;
  this.eventId = null;
  if (args) {
    if (args.source !== undefined && args.source !== null) {
      this.source = args.source;
    }
    if (args.timestamp !== undefined && args.timestamp !== null) {
      this.timestamp = args.timestamp;
    }
    if (args.reason !== undefined && args.reason !== null) {
      this.reason = args.reason;
    }
    if (args.details !== undefined && args.details !== null) {
      this.details = args.details;
    }
    if (args.category !== undefined && args.category !== null) {
      this.category = args.category;
    }
    if (args.level !== undefined && args.level !== null) {
      this.level = args.level;
    }
    if (args.entity !== undefined && args.entity !== null) {
      this.entity = args.entity;
    }
    if (args.nodeId !== undefined && args.nodeId !== null) {
      this.nodeId = args.nodeId;
    }
    if (args.eventId !== undefined && args.eventId !== null) {
      this.eventId = args.eventId;
    }
  }
};
Event.prototype = {};
Event.prototype.read = function(input) {
  input.readStructBegin();
  while (true) {
    var ret = input.readFieldBegin();
    var ftype = ret.ftype;
    var fid = ret.fid;
    if (ftype == Thrift.Type.STOP) {
      break;
    }
    switch (fid) {
      case 1:
      if (ftype == Thrift.Type.STRING) {
        this.source = input.readString();
      } else {
        input.skip(ftype);
      }
      break;
      case 2:
      if (ftype == Thrift.Type.I64) {
        this.timestamp = input.readI64();
      } else {
        input.skip(ftype);
      }
      break;
      case 3:
      if (ftype == Thrift.Type.STRING) {
        this.reason = input.readString();
      } else {
        input.skip(ftype);
      }
      break;
      case 4:
      if (ftype == Thrift.Type.STRING) {
        this.details = input.readString();
      } else {
        input.skip(ftype);
      }
      break;
      case 5:
      if (ftype == Thrift.Type.I32) {
        this.category = input.readI32();
      } else {
        input.skip(ftype);
      }
      break;
      case 7:
      if (ftype == Thrift.Type.I32) {
        this.level = input.readI32();
      } else {
        input.skip(ftype);
      }
      break;
      case 8:
      if (ftype == Thrift.Type.STRING) {
        this.entity = input.readString();
      } else {
        input.skip(ftype);
      }
      break;
      case 9:
      if (ftype == Thrift.Type.STRING) {
        this.nodeId = input.readString();
      } else {
        input.skip(ftype);
      }
      break;
      case 10:
      if (ftype == Thrift.Type.I32) {
        this.eventId = input.readI32();
      } else {
        input.skip(ftype);
      }
      break;
      default:
        input.skip(ftype);
    }
    input.readFieldEnd();
  }
  input.readStructEnd();
  return;
};

Event.prototype.write = function(output) {
  output.writeStructBegin('Event');
  if (this.source !== null && this.source !== undefined) {
    output.writeFieldBegin('source', Thrift.Type.STRING, 1);
    output.writeString(this.source);
    output.writeFieldEnd();
  }
  if (this.timestamp !== null && this.timestamp !== undefined) {
    output.writeFieldBegin('timestamp', Thrift.Type.I64, 2);
    output.writeI64(this.timestamp);
    output.writeFieldEnd();
  }
  if (this.reason !== null && this.reason !== undefined) {
    output.writeFieldBegin('reason', Thrift.Type.STRING, 3);
    output.writeString(this.reason);
    output.writeFieldEnd();
  }
  if (this.details !== null && this.details !== undefined) {
    output.writeFieldBegin('details', Thrift.Type.STRING, 4);
    output.writeString(this.details);
    output.writeFieldEnd();
  }
  if (this.category !== null && this.category !== undefined) {
    output.writeFieldBegin('category', Thrift.Type.I32, 5);
    output.writeI32(this.category);
    output.writeFieldEnd();
  }
  if (this.level !== null && this.level !== undefined) {
    output.writeFieldBegin('level', Thrift.Type.I32, 7);
    output.writeI32(this.level);
    output.writeFieldEnd();
  }
  if (this.entity !== null && this.entity !== undefined) {
    output.writeFieldBegin('entity', Thrift.Type.STRING, 8);
    output.writeString(this.entity);
    output.writeFieldEnd();
  }
  if (this.nodeId !== null && this.nodeId !== undefined) {
    output.writeFieldBegin('nodeId', Thrift.Type.STRING, 9);
    output.writeString(this.nodeId);
    output.writeFieldEnd();
  }
  if (this.eventId !== null && this.eventId !== undefined) {
    output.writeFieldBegin('eventId', Thrift.Type.I32, 10);
    output.writeI32(this.eventId);
    output.writeFieldEnd();
  }
  output.writeFieldStop();
  output.writeStructEnd();
  return;
};

