# Copyright 2004-present Facebook. All Rights Reserved.

namespace cpp facebook.terragraph.thrift
namespace py terragraph.aquaman.IpPrefix

# fbstring uses the small internal buffer to store the data
# if the data is small enough (< 24 bytes).
typedef binary (cpp.type = "::folly::fbstring") fbbinary

enum AddressType {
  VUNSPEC = 0,
  V4 = 1,
  V6 = 2,
}

struct Address {
  1: required string addr,
  2: required AddressType type,
  3: optional i64 port = 0,
}

struct BinaryAddress {
  1: required fbbinary addr,
  2: optional i64 port = 0,
  3: optional string ifName = "";   // Used in AristaFibAgent for nexthop iface
}

struct IpPrefix {
  1: BinaryAddress prefixAddress
  2: i16 prefixLength
}

struct UnicastRoute {
  1: required IpPrefix dest,
  2: required list<BinaryAddress> nexthops,
}
